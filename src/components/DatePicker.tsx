// DatePicker.tsx
import React from "react";
import {
  LocalizationProvider,
  DateCalendar,
  PickersDay,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import useFilterStore from "../contexts/useFilterStore";
import useDocumentStore from "../contexts/useDocumentStore";
import { Badge } from "@mui/material";

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

  return (
    <ThemeProvider theme={theme}>
      <div className="text-black dark:text-white">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={selectedDate}
            onChange={handleDateChange}
            slots={{
              day: CustomDay,
            }}
          />
        </LocalizationProvider>
      </div>
    </ThemeProvider>
  );
};

export default DatePicker;
