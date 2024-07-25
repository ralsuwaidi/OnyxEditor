import React from "react";
import {
  LocalizationProvider,
  DateCalendar,
  PickersDay,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import useFilterStore from "../contexts/useFilterStore";
import useDocumentStore from "../contexts/useDocumentStore";
import { Badge, Button } from "@mui/material";

const DatePicker: React.FC = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const { selectedDate, setSelectedDate } = useFilterStore();
  const { documents } = useDocumentStore();

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  const handleClearFilter = () => {
    setSelectedDate(null);
  };

  const handleSetToday = () => {
    setSelectedDate(dayjs());
  };

  // Create a Set of dates that have documents
  const documentDates = React.useMemo(() => {
    return new Set(
      documents
        .filter((doc) => doc.type == "journal")
        .map((doc) => doc.created_at.split("T")[0])
    );
  }, [documents]);

  // Custom day component
  const CustomDay = (props: any) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const formattedDate = day.format("YYYY-MM-DD");
    const hasDocument = documentDates.has(formattedDate);
    const isSelected = selectedDate && day.isSame(selectedDate, "day");

    return (
      <Badge
        key={props.day.toString()}
        overlap="circular"
        badgeContent={
          hasDocument ? (
            <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
          ) : null
        }
      >
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
          selected={isSelected}
        />
      </Badge>
    );
  };

  const isTodaySelected = selectedDate
    ? selectedDate.isSame(dayjs(), "day")
    : false;

  return (
    <ThemeProvider theme={theme}>
      <div className="flex justify-center m-2">
        <Button
          variant="text"
          color="primary"
          disabled={!selectedDate}
          onClick={handleClearFilter}
        >
          Clear
        </Button>
        <Button
          variant="text"
          color="primary"
          onClick={handleSetToday}
          disabled={isTodaySelected}
        >
          Today
        </Button>
      </div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={selectedDate}
          onChange={handleDateChange}
          slots={{
            day: CustomDay,
          }}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default DatePicker;
