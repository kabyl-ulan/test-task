import React, { useEffect, useState } from "react";
import { PUBLIC_API } from "../../api";

function ContributionGraph() {
  const [contributions, setContributions] = useState({});

  const currentDate = new Date();

  const getContribution = async () => {
    try {
      const { data } = await PUBLIC_API.get("test/calendar.json");
      setContributions(data);
    } catch (error) {
      console.log(error);
    }
  };

  const renderGrid = () => {
    const grid = [];
    const currentDayofWeek = currentDate.getDay();

    const rows = 7;
    const column = 51;

    for (let i = 0; i < rows; i++) {
      const row = [];

      for (let j = 0; j < column; j++) {
        const date = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + (rows - currentDayofWeek) - (j * rows + i)
        );

        const contributionCount =
          contributions[date.toISOString().split("T")[0]] || 0;
        let colorClass = getColorClass(contributionCount);

        row.push(
          <div
            key={`${i}-${j}`}
            className={`contribution-block ${colorClass}`}
            onClick={() => {
              const originalDate = new Date(date);

              const options = {
                weekday: "long", // Полное название дня недели
                month: "long", // Полное название месяца
                day: "numeric", // День месяца
                year: "numeric", // Полный год
              };

              const formattedDate = originalDate.toLocaleDateString(
                "ru-RU",
                options
              );

              alert(`${contributionCount} contrubuints,  ${formattedDate}`);
            }}
          ></div>
        );
      }

      grid.push(
        <div key={i} className="contribution-row">
          {row.reverse()}
        </div>
      );
    }

    return grid.reverse();
  };

  const renderMonthLabels = () => {
    const monthLabels = [];
    const currentMonth = new Date().getMonth();
    const displayedMonths = new Set();

    for (let i = 0; i < 51; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentMonth,
        currentDate.getDate() - i * 7
      );
      const monthLabel = date.toLocaleDateString("ru-RU", { month: "short" });

      if (!displayedMonths.has(monthLabel)) {
        monthLabels.push(
          <div key={`month-${i}`} className="month--label">
            {monthLabel}
          </div>
        );
        displayedMonths.add(monthLabel);
      } else {
        monthLabels.push(
          <div key={`month-${i}`} className="month--label-empty" />
        );
      }
    }

    return monthLabels.reverse();
  };

  const getColorClass = (contributionCount) => {
    if (contributionCount === 0) {
      return "no-contribution";
    } else if (contributionCount >= 1 && contributionCount <= 9) {
      return "low-contribution";
    } else if (contributionCount >= 10 && contributionCount <= 19) {
      return "medium-contribution";
    } else if (contributionCount >= 20 && contributionCount <= 29) {
      return "high-contribution";
    } else {
      return "max-contribution";
    }
  };

  const dayLabel = () => {
    return (
      <div>
        <div className="day-label"></div>
        <div className="day-label">Пн</div>
        <div className="day-label"></div>
        <div className="day-label">Ср</div>
        <div className="day-label"></div>
        <div className="day-label">Пт</div>
      </div>
    );
  };

  const lightIndicator = () => {
    const contributionRanges = [
      { className: "no-contribution", range: "No contributions" },
      { className: "low-contribution", range: "1-9 contributions" },
      { className: "medium-contribution", range: "10-19 contributions" },
      { className: "high-contribution", range: "20-29 contributions" },
      { className: "max-contribution", range: "30+ contributions" },
    ];
    return (
      <div className="light-indicator">
        <p className="light-indicator__text">Меньше</p>
        <div className="light-indicator__colors">
          {contributionRanges.map((elem, index) => (
            <div
              key={index}
              className={`contribution-block ${elem.className}`}
              onClick={() => alert(elem.range)}
            ></div>
          ))}
        </div>
        <p className="light-indicator__text">Больше</p>
      </div>
    );
  };

  useEffect(() => {
    getContribution();
  }, []);
  return (
    <div className="container">
      <div className="contribution">
        {dayLabel()}
        <div className="contribution--graph">
          <div className="month">{renderMonthLabels()}</div>
          {!!contributions && renderGrid()}
          <>{lightIndicator()}</>
        </div>
      </div>
    </div>
  );
}

export default ContributionGraph;
