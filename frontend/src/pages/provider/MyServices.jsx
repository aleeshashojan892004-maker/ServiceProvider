import "./MyServices.css";

const myServices = [
  {
    id: 1,
    name: "AC Repair",
    price: 499,
    status: "Active",
  },
  {
    id: 2,
    name: "Bathroom Cleaning",
    price: 799,
    status: "Active",
  },
  {
    id: 3,
    name: "Electrician",
    price: 299,
    status: "Inactive",
  },
];

const MyServices = () => {
  return (
    <div className="my-services">
      <h1>My Services</h1>
      <p className="subtitle">List of services you provide</p>

      <table className="services-table">
        <thead>
          <tr>
            <th>Service Name</th>
            <th>Price (₹)</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {myServices.map((service) => (
            <tr key={service.id}>
              <td>{service.name}</td>
              <td>{service.price}</td>
              <td>
                <span
                  className={
                    service.status === "Active"
                      ? "status active"
                      : "status inactive"
                  }
                >
                  {service.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyServices;
