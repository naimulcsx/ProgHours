import { HttpService } from "@nestjs/axios"
import { Injectable } from "@nestjs/common"
import { lastValueFrom } from "rxjs"
import * as cheerio from "cheerio"
import * as path from "path"
import * as url from "url"
import ShortUniqueId from "short-unique-id"

const UrlPattern = require("url-pattern")
const genId = new ShortUniqueId({ length: 6 })

@Injectable()
export class ParsersService {
  constructor(private httpService: HttpService) {}

  isValidLink(link) {
    let url
    try {
      url = new URL(link)
    } catch (_) {
      return false
    }
    return url.protocol === "http:" || url.protocol === "https:"
  }

  async parseProblem(link) {
    const parserMap = {
      "codeforces.com": this.cfParser,
      "lightoj.com": this.lightOJParser,
      "onlinejudge.org": this.uvaParser,
      "cses.fi": this.csesParser,
      "toph.co": this.tophParser,
      "spoj.com": this.spojParser,
      "www.spoj.com": this.spojParser,
      "atcoder.jp": this.atCoderParser,
      "www.atcoder.jp": this.atCoderParser,
      "vjudge.net": this.vjudgeParser,
      "codechef.com": this.ccParser,
      "www.codechef.com": this.ccParser,
      "www.eolymp.com": this.eOlympParser,
    }

    try {
      let hostname = new URL(link).hostname
      /**
       * If we have a dedicated parser for the OJ
       */
      if (parserMap[hostname]) {
        const parsedResult = await parserMap[hostname].call(this, link)
        return parsedResult
      } else {
        /**
         * We don't have a parser for the link
         */
        return {
          pid: genId(),
          name: this.isValidLink(link) ? genId() : link,
          tags: [],
          difficulty: 0,
          judge_id: null,
        }
      }
    } catch (err) {
      throw err
    }
  }

  /**
   **  Parser for codeforces.com
   */
  async cfParser(link) {
    /**
     * Check if the problem link is valid
     */
    const linkUrl = new URL(link)
    const cfValidPatterns = [
      new UrlPattern("/contest/:contestId/problem/:problemId"),
      new UrlPattern("/problemset/problem/:contestId/:problemId"),
      new UrlPattern("/gym/:gymId/problem/:problemId"),
    ]

    let matchedResult: any
    let isInvalid: boolean = true
    cfValidPatterns.forEach((pattern) => {
      let result = pattern.match(linkUrl.pathname)
      if (result) {
        matchedResult = result
        isInvalid = false
      }
    })

    if (isInvalid) {
      throw new Error("Invalid codeforces link!")
    }

    /**
     * Get the source of the provided codeforces link
     */
    const { data } = await lastValueFrom(this.httpService.get(link))
    const $ = cheerio.load(data)

    /**
     * Valid pattern but wrong URL, example problem `Z` would less likely to exist in Codeforces rounds
     * In that case, https://codeforces.com/contest/1616/problem/Z is a valid matching pattern but the problem doesn't exist
     */
    isInvalid = $(".title a").html() !== null
    if (isInvalid) {
      throw new Error("Invalid codeforces link!")
    }

    /**
     * Extract informations from source
     */
    const pid = matchedResult.contestId
      ? `CF-${matchedResult.contestId}${matchedResult.problemId}`
      : `Gym-${matchedResult.gymId}${matchedResult.problemId}`
    const name = $(".title").html().split(". ")[1]

    /**
     * Iterate over all tags of the problem
     */
    const tags = []
    let difficulty = 0
    $(".roundbox .tag-box").each(function (i, e) {
      const tag = $(this).text().trim()
      /**
       * Extract the tag with starts with * - use it as tje problem difficulty
       */
      if (tag.includes("*") && tag.indexOf("*") === 0)
        difficulty = parseInt(tag.substring(1))
      else tags.push(tag)
    })

    /**
     * Set judge_id for codeforces
     */
    const judge_id = 1
    return {
      pid,
      name,
      tags,
      difficulty,
      judge_id,
      /**
       * Removing query params before saving the link into database
       */
      link: matchedResult.contestId
        ? `https://codeforces.com/contest/${matchedResult.contestId}/problem/${matchedResult.problemId}`
        : `https://codeforces.com/gym/${matchedResult.gymId}/problem/${matchedResult.problemId}`,
    }
  }

  /**
   *  Parser for lightoj.com
   */
  async lightOJParser(link) {
    /**
     * Check if the problem link is valid
     */
    const linkUrl = new URL(link)
    const lightOjPattern = new UrlPattern("/problem/:problemName")
    let matchedResult = lightOjPattern.match(linkUrl.pathname)
    let isInvalid: boolean = matchedResult === null
    if (isInvalid) {
      throw new Error("Invalid LightOJ link!")
    }
    /**
     * Get the page source
     */
    try {
      const response = await lastValueFrom(this.httpService.get(link))
      /**
       * Getting the original URL
       * `https://lightoj.com/problem/1026` redirects to `https://lightoj.com/problem/critical-links`
       * So always saving `https://lightoj.com/problem/critical-links` into database
       */
      const originalUrl =
        response?.request?.socket?._httpMessage?.res?.responseUrl

      const $ = cheerio.load(response.data)
      /**
       * Extract informations
       */
      const pid = $(".tags .is-link").text().trim()
      const name = $(".title").text().trim()
      /**
       * Todo: We can assign difficulty based of the difficulty tag - easy, medium, hard etc.
       */
      const difficulty = 0
      const tags = []
      const judge_id = 6
      return {
        pid,
        name,
        tags,
        difficulty,
        judge_id,
        /**
         * Constructing link again for ignoring query params
         */
        link: originalUrl,
      }
    } catch (err) {
      console.log(err)
      throw new Error("Invalid LightOJ link!")
    }
  }

  /**
   *  Parser for onlineJudge.com(UVA)
   */
  async uvaParser(link) {
    const response = await lastValueFrom(this.httpService.get(link))
    const $ = cheerio.load(response.data)

    const str = $(".floatbox tr td h3").text().trim()
    const parts = str.split(" - ")

    const pid = "UVA-" + parts[0]
    const name = parts.slice(1).join(" ").trim()
    const difficulty = 0
    const tags = []
    const judge_id = 7

    return {
      pid,
      name,
      tags,
      difficulty,
      judge_id,
    }
  }

  /**
   *  Parser for cses.fi(CSES)
   */
  async csesParser(link) {
    const { data } = await lastValueFrom(this.httpService.get(link))
    const $ = cheerio.load(data)

    const name = $(".title-block h1").text().trim()

    // problem id
    const { name: pathName } = path.parse(link)
    const splitName = pathName.includes("lang")
      ? pathName.split("?")[0]
      : pathName

    const pid = "CSES-" + splitName

    // problem difficulty
    const difficulty = 0

    // problem tags
    const tags = []

    // attached judge_id
    const judge_id = 8

    return {
      pid,
      name,
      tags,
      difficulty,
      judge_id,
    }
  }

  /**
   *  Parser for toph.co
   */
  async tophParser(link) {
    const { data } = await lastValueFrom(this.httpService.get(link))
    const $ = cheerio.load(data)

    // problem name
    const pname = $(".artifact__caption h1").text().trim()
    const name = pname

    /// problem id
    const { name: pathName } = path.parse(link)
    const splitName = pathName.includes("lang")
      ? pathName.split("?")[0]
      : pathName

    const pid = "TH-" + splitName

    // problem difficulty
    const difficulty = 0

    // problem tags
    const tags = []
    $(".flair__item .text a").each(function () {
      const tag = $(this).text().trim()
      tags.push(tag)
    })
    const judge_id = 5

    return {
      pid,
      name,
      tags,
      difficulty,
      judge_id,
    }
  }

  /**
   *  Parser for spoj.com
   */
  async spojParser(link) {
    const { data } = await lastValueFrom(this.httpService.get(link))
    const $ = cheerio.load(data)

    const str = $(".prob #problem-name").text().trim()
    const parts = str.split(" - ")
    const name = parts[1]
    const pid = "SPOJ-" + parts[0]

    const difficulty = 0
    const tags = []
    const judge_id = 2

    return {
      pid,
      name,
      tags,
      difficulty,
      judge_id,
    }
  }
  /**
   *  Parser for spoj.com
   */
  async atCoderParser(link) {
    const { data } = await lastValueFrom(this.httpService.get(link))
    const $ = cheerio.load(data)

    // problem name
    const parse = $("#main-container .row span.h2").text().trim()
    const name = parse.split("\n")[0].split("-")[1]

    // problem Id
    const parseLink = url.parse(link, true)
    const splitName = parseLink.pathname.split("/")[4]
    const pid = "AC-" + splitName

    // problem difficulty
    const difficulty = 0

    // problem tags
    const tags = []
    const judge_id = 4

    return {
      pid,
      name,
      tags,
      difficulty,
      judge_id,
    }
  }

  /**
   *  Parser for vjudge
   */
  async vjudgeParser(link) {
    /**
     * TODO: fix vjudge parser
     */
    return {
      pid: "test",
      name: "test",
      tags: [],
      difficulty: 0,
      judge_id: 2,
    }
  }

  /**
   *  Parser for codechef
   */
  async ccParser(link) {
    /**
     * Check if the problem link is valid
     */
    const linkUrl = new URL(link)
    const ccUrlPatterns = [
      new UrlPattern("/problems/:problemId"),
      new UrlPattern("/:contestId/problems/:problemId"),
    ]
    let isInvalid = true
    let patternResult: any
    ccUrlPatterns.forEach((pattern) => {
      const result = pattern.match(linkUrl.pathname)
      if (result) {
        patternResult = result
        isInvalid = false
      }
    })

    if (isInvalid) {
      throw new Error("Invalid CodeChef link!")
    }

    /**
     * Get the problem id
     */

    const problemId = patternResult.problemId
    const apiLink = `https://www.codechef.com/api/contests/PRACTICE/problems/${problemId}`
    const response = await lastValueFrom(this.httpService.get(apiLink))

    /**
     * If the problem id is invalid
     */
    if (response.data?.status === "error") {
      throw new Error("Invalid CodeChef link!")
    }

    const pid = `CC-${response.data.problem_code}`
    const name = response.data.problem_name

    return {
      pid,
      name,
      tags: [],
      difficulty: 0,
      judge_id: 2,
      link: `https://www.codechef.com/problems/${response.data.problem_code}`,
    }
  }

  /**
   *  Parser for eOlymp
   */
  async eOlympParser(link) {
    /**
     * Check if the problem link is valid
     */
    const linkUrl = new URL(link)

    const eOlympValidPatterns = [
      new UrlPattern("/en/problems/:problemId"),
      new UrlPattern("/en/contests/:contestId/problems/:problemId"),
    ]

    let matchedResult: any
    let isInvalid: boolean = true
    eOlympValidPatterns.forEach((pattern) => {
      let result = pattern.match(linkUrl.pathname)

      if (result) {
        matchedResult = result
        isInvalid = false
      }
    })

    if (isInvalid) {
      throw new Error("Invalid eolymp link!")
    }

    // Extract data from provided link
    const { data } = await lastValueFrom(this.httpService.get(link))
    const $ = cheerio.load(data)

    // problem name
    const name = $(".eo-paper__header").text().trim()

    // problem ID
    const pid = matchedResult.contestId
      ? `EOlymp-${matchedResult.contestId}`
      : `EOlymp-${matchedResult.problemId}`

    return {
      pid,
      name,
      tags: [],
      difficulty: 0,
      judge_id: 9,
      link: matchedResult.contestId
        ? `https://www.eolymp.com/en/contests/${matchedResult.contestId}/${matchedResult.problemId}`
        : `https://www.eolymp.com/en/problems/${matchedResult.problemId}`,
    }
  }
}
