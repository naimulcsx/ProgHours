import moment from "moment";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { Box, Flex, Paper, Text, Title, Transition } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";

import {
  UserSubmissionsResponse,
  useUserSubmissions
} from "@proghours/data-access";

import { SubmissionsDataTable } from "~/modules/dashboard/submissions/components/table";

export function SubmissionsTab() {
  const { username } = useParams();
  const [searchParams] = useSearchParams();

  const { data, isSuccess, isFetching } = useUserSubmissions({
    username: username!
  });

  const [filteredData, setFilteredData] = useState<UserSubmissionsResponse>([]);
  const [value, setValue] = useState<Date | null>(null);

  useEffect(() => {
    if (data) setFilteredData(data);
  }, [data]);

  useEffect(() => {
    const date = searchParams.get("date");
    if (date) {
      setValue(moment(date, "DD-MM-YYYY").toDate());
    }
  }, [searchParams]);

  useEffect(() => {
    if (value && data) {
      setFilteredData(
        data.filter(
          (el) =>
            moment(el.solvedAt).utcOffset(0).format("DD-MM-YYYY") ===
            moment(value).utcOffset(0).format("DD-MM-YYYY")
        )
      );
    }
  }, [data, value]);

  return (
    <Box mt="lg">
      <Flex justify="space-between">
        <Title order={4}>Submissions</Title>
        <Flex align="center" gap="xs">
          <Text size="xs">Filter by Date:</Text>
          <DatePickerInput
            size="xs"
            placeholder="Pick date"
            value={value}
            onChange={setValue}
            miw={140}
            h={30}
          />
        </Flex>
      </Flex>
      <Transition mounted={!isFetching} transition="fade" duration={300}>
        {(styles) => (
          <Box style={{ ...styles, transitionDelay: "250ms" }}>
            {isSuccess && (
              <Paper
                mt="md"
                style={{
                  borderRadius: "var(--mantine-radius-md)",
                  background: "hsl(var(--secondary) / 0.5)"
                }}
              >
                <SubmissionsDataTable
                  editable={false}
                  data={[...filteredData]
                    .reverse()
                    .map((el, i) => ({ ...el, serial: i + 1 }))
                    .reverse()}
                />
              </Paper>
            )}
          </Box>
        )}
      </Transition>
    </Box>
  );
}