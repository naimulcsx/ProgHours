import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common"
import { IsAuthenticatedGuard } from "src/guards/is-authenticated"
import { CreateHandleDto } from "src/validators/create-handle-dto"
import { HandlesService } from "./handles.service"

@Controller("handles")
export class HandlesController {
  constructor(private readonly handleService: HandlesService) {}

  @Post("")
  @UseGuards(IsAuthenticatedGuard)
  async createOJHandles(@Body() body: CreateHandleDto, @Req() req: any) {
    const { handle, judge_id } = body

    const foundHandle = await this.handleService.findHandles({
      user_id: req.user.id,
      judge_id,
    })
    if (foundHandle) throw new ForbiddenException("handle already exists")

    const newHandle = await this.handleService.createHandles({
      handle,
      judge_id,
      user_id: req.user.id,
    })

    return { newHandle }
  }

  @Get("")
  @UseGuards(IsAuthenticatedGuard)
  async findHandles(@Req() req) {
    const handles = await this.handleService.findAllHandles(req.user.id)

    return { handles }
  }
}
