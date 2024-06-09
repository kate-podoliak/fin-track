import React, { useEffect, useState } from "react";
import axios from "axios";

interface EventCount {
    type: string
}

const EventCount = ({type}: EventCount) => {
  const [eventCount, setEventCount] = useState(0);

  const loadEventCount = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/events/count-ending`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setEventCount(response.data);
    } catch (error) {
      console.error("Помилка при завантаженні кількості фінансових подій:", error);
    }
  };

  useEffect(() => {
    loadEventCount();
  }, []);

  return (
    type === "main" ? <div
      style={{
        width: 15,
        height: 15,
        backgroundColor: "red",
        color: "white",
        borderRadius: 100,
        fontSize: 8,
        display: eventCount > 0 ? "block" : "none",
        position: "absolute",
        top: 12,
        left: 15,
        lineHeight: 1.9,
        textAlign: "center",
      }}
    >
      {eventCount}
    </div> : <div
        style={{
          width: 17,
          height: 17,
          backgroundColor: "red",
          color: "white",
          borderRadius: 100,
          fontSize: 10,
          display: "block",
          lineHeight: 1.6,
          textAlign: "center",
          float: "right",
          margin: "4px 0 0"
        }}
    >
        {eventCount}
    </div>
  );
};

export default EventCount;
