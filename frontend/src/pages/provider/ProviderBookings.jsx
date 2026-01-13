import "./ProviderBookings.css";

const bookings = [
  {
    id: 1,
    customer: "Rahul Sharma",
    service: "AC Repair",
    date: "12 Sep 2026",
    status: "Pending",
  },
  {
    id: 2,
    customer: "Anjali Verma",
    service: "Bathroom Cleaning",
    date: "10 Sep 2026",
    status: "Completed",
  },
  {
    id: 3,
    customer: "Amit Kumar",
    service: "Electrician",
    date: "08 Sep 2026",
    status: "Cancelled",
  },
];

const ProviderBookings = () => {
  return (
    <div className="provider-bookings">
      <h1>Bookings</h1>
      <p className="subtitle">Recent service bookings (dummy data)</p>

      <table className="bookings-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Service</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.customer}</td>
              <td>{booking.service}</td>
              <td>{booking.date}</td>
              <td>
                <span
                  className={
                    booking.status === "Completed"
                      ? "status completed"
                      : booking.status === "Pending"
                      ? "status pending"
                      : "status cancelled"
                  }
                >
                  {booking.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProviderBookings;
