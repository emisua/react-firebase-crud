import { Gasto } from '~/interfaces/interfaces';
interface Gastos {
  gastos: Gasto[];
}

const Table = ({ gastos }: Gastos) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-sm w-full">
        {/* head */}
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Description</th>
            <th>price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* rows*/}
          {gastos.map(({ name, description, buyDate, id, price }) => {
            const gastoDate: string = buyDate?.toDate().toLocaleDateString('es-ES')!;
            console.log({ gastoDate });
            return (
              <tr key={id}>
                <td>{gastoDate}</td>
                <td>{name}</td>
                <td>{description}</td>
                <td>{price}</td>
                <th>
                  <button className="btn btn-ghost btn-xs">details</button>
                </th>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default Table;
