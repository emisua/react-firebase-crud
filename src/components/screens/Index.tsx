import React, { useState, useEffect } from 'react';
import uuid from 'react-uuid';
import { collection, getDocs, query, addDoc } from 'firebase/firestore';
import { useAuthState } from '~/components/contexts/UserContext';
import { Head } from '~/components/shared/Head';
import { useFirestore } from '~/lib/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Gasto } from '~/interfaces/interfaces';
import Table from '../shared/Table';

function Index() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const firestore = useFirestore();
  const [newGasto, setNewGasto] = useState<Partial<Gasto>>({
    name: '',
    description: '',
    price: '',
  });
  const newGastoSucess = () => toast.success('Gasto añadido');
  const newGastoError = () => toast.error('Ha habido un error creando el gasto');

  useEffect(() => {
    async function fetchData() {
      const gastosCollection = collection(firestore, 'gastos');
      const gastosQuery = query(gastosCollection);
      const querySnapshot = await getDocs(gastosQuery);
      const fetchedData: Gasto[] = [];
      querySnapshot.forEach((gst) => {
        fetchedData.push({ id: gst.id, ...gst.data() } as Gasto);
      });
      setGastos(fetchedData);
    }
    fetchData();
  }, []);

  enum InputGasto {
    Name = 'name',
    Description = 'desc',
    Price = 'price',
  }

  function handleInputChange(field: InputGasto, value: string) {
    setNewGasto({ ...newGasto, [field]: value });
  }
  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log('Enviando....');

    try {
      const gastosCollection = collection(firestore, 'gastos');
      const addNewGasto: Gasto = {
        ...newGasto,
        id: uuid(),
        buyDate: new Date(),
      };
      await addDoc(gastosCollection, addNewGasto);
      newGastoSucess();
      setGastos([...gastos, addNewGasto]);
      setNewGasto({
        name: '',
        description: '',
        price: '',
      });
    } catch (error) {
      newGastoError();
    }

    // Save data to firebase
    // Update State of Gastos
    // Clear form
  }

  return (
    <>
      <Head title="TOP PAGE" />
      <Table gastos={gastos} />
      <main className="flex justify-center container">
        <div className="card w-96 bg-base-100 shadow-2xl">
          <div className="card-body">
            <h2 className="card-title">Añadir un nuevo gasto</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Qué te has comprado, pillín/a?</span>
                </label>
                <input
                  type="text"
                  placeholder="Videojuego, zapatillas, etc.."
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => handleInputChange(InputGasto.Name, e.target.value)}
                  value={newGasto.name}
                  required
                />
              </div>
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Y cuánto te has gastado?</span>
                </label>
                <input
                  type="text"
                  placeholder="Introduce el importe"
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => handleInputChange(InputGasto.Price, e.target.value)}
                  value={newGasto.price}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Quieres agregar una descripción?</span>
                  <span className="label-text-alt text-gray-400">Opcional</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="Descripción de tu compra"
                  onChange={(e) => handleInputChange(InputGasto.Description, e.target.value)}
                  value={newGasto.description}
                />
              </div>
              <div className="card-actions justify-end mt-6">
                <button className="btn btn-primary">Agregar gasto</button>
              </div>
            </form>
            <ToastContainer />
          </div>
        </div>
      </main>
    </>
  );
}

export default Index;
