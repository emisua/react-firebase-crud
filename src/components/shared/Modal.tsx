import React, { useState } from 'react';
import uuid from 'react-uuid';
import { collection, getDocs, query, addDoc, Timestamp } from 'firebase/firestore';
import { useFirestore } from '~/lib/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Gasto } from '~/interfaces/interfaces';

enum InputGasto {
  Name = 'name',
  Description = 'description',
  Price = 'price',
}

interface ModalProps {
  gastos: Gasto[];
  setGastos: React.Dispatch<React.SetStateAction<Gasto[]>>;
}

const Modal = ({ gastos, setGastos }: ModalProps) => {
  const firestore = useFirestore();
  const [newGasto, setNewGasto] = useState<Gasto>({
    name: '',
    description: '',
    price: '',
  });
  const newGastoSucess = () => toast.success('Gasto añadido');
  const newGastoError = () => toast.error('Ha habido un error creando el gasto');
  function handleInputChange(field: InputGasto, value: string) {
    setNewGasto({ ...newGasto, [field]: value });
  }
  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log('Enviando....');

    try {
      const gastosCollection = collection(firestore, 'gastos');
      const fecha = new Date();
      const addNewGasto: Gasto = {
        ...newGasto,
        id: uuid(),
        buyDate: Timestamp.now(),
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
      <label htmlFor="my_modal_6" className="btn mb-6">
        + Nuevo gasto
      </label>

      <input type="checkbox" id="my_modal_6" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h2 className="card-title text-3xl mb-4">Añadir un nuevo gasto</h2>
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
                onChange={(e) => {
                  console.log(e);
                  handleInputChange(InputGasto.Description, e.target.value);
                }}
                value={newGasto.description}
              />
            </div>
            <div className="card-actions justify-between mt-6">
              <label htmlFor="my_modal_6" className="btn">
                Cancelar
              </label>
              <button type="submit" className="btn btn-primary">
                Agregar gasto
              </button>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </>
  );
};
export default Modal;
