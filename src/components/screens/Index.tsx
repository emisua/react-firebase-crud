import { useState, useEffect } from 'react';
import { collection, getDocs, query, addDoc } from 'firebase/firestore';
import { Head } from '~/components/shared/Head';
import { useFirestore } from '~/lib/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Gasto } from '~/interfaces/interfaces';
import Table from '../shared/Table';
import Modal from '../shared/Modal';

function Index() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const firestore = useFirestore();
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

  return (
    <div className="container mx-auto">
      <Head title="TOP PAGE" />
      <main>
        <Modal gastos={gastos} setGastos={setGastos} />
        <Table gastos={gastos} />
      </main>
    </div>
  );
}

export default Index;
