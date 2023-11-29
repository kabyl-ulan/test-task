import React, { useEffect, useState } from "react";
import { PUBLIC_API } from "../../api";
import { formatDateToISO, formatDateToString, getColorClass } from "./config";

function ContributionGraph() {
  const [contributions, setContributions] = useState({});
  const currentDate = new Date();
  const rows = 7;
  const column = 51;

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

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < column; j++) {
        const date = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + (rows - currentDayofWeek) - (j * rows + i)
        );
        const contributionCount = contributions[formatDateToISO(date)] || 0;
        let colorClass = getColorClass(contributionCount);
        row.push({
          key: `${i}-${j}`,
          className: `contribution-block ${colorClass}`,
          contributionCount,
          date,
        });
      }

      grid.push({
        key: i,
        className: "contribution-row",
        children: row.reverse(),
      });
    }

    return grid.reverse();
  };

  const renderMonthLabels = () => {
    const monthLabels = [];
    const currentMonth = new Date().getMonth();
    const displayedMonths = new Set();

    for (let i = 0; i < column; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentMonth,
        currentDate.getDate() - i * rows
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
      {
        className: "contribution-block no-contribution",
        contributionCount: "No",
      },
      {
        className: "contribution-block low-contribution",
        contributionCount: "1-9",
      },
      {
        className: "contribution-block medium-contribution",
        contributionCount: "10-19",
      },
      {
        className: "contribution-block high-contribution",
        contributionCount: "20-29",
      },
      {
        className: "contribution-block max-contribution",
        contributionCount: "30+",
      },
    ];
    return (
      <div className="light-indicator">
        <p className="light-indicator__text">Меньше</p>
        <div className="light-indicator__colors">
          {contributionRanges.map((elem, index) => (
            <Square key={index} elem={elem} />
          ))}
        </div>
        <p className="light-indicator__text">Больше</p>
      </div>
    );
  };

  const Square = ({ elem }) => {
    const { contributionCount, date, className } = elem;
    const [isVisible, setVisible] = useState(false);
    return (
      <div
        className={className}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible(true)}
      >
        {isVisible && (
          <div className="popup">
            <div className="popup-text">
              <p className="popup-text__contributions">{`${
                contributionCount === 0 ? "No" : contributionCount
              } contributions`}</p>
              <p className="popup-text__date">
                {date && formatDateToString(date)}
              </p>
            </div>
          </div>
        )}
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
          {!!contributions &&
            renderGrid().map((row) => (
              <div key={row.key} className={row.className}>
                {row.children.map((elem) => (
                  <Square key={elem.key} elem={elem} />
                ))}
              </div>
            ))}
          <>{lightIndicator()}</>
        </div>
      </div>
    </div>
  );
}

export default ContributionGraph;
