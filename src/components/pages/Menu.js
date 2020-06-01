import React, {useState, useContext, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../../firebase';

import Plato from '../ui/Plato';
const Menu = () => {
    
    const [platos, guardarPlatos] = useState([]);
    const {firebase} = useContext(FirebaseContext)
    
    useEffect(() => {
        const obtenerPlato = () => {
            firebase.db.collection('productos').onSnapshot(handleSnapshot);

            //console.log(resultado);
        }
        obtenerPlato();
    }, [])

    // snapShot nos permite usar la base de datos en tiempo real de firestore
    function handleSnapshot(snapshot){
        const platos = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        });
        // almacenar resultados en el state.
        guardarPlatos(platos);
    }
    return ( 
        <>
            <h1 className=" text-3xl font-light mb-4">Menu</h1>

            <Link 
                className="bg-blue-800 hover:bg-blue-700 inline-block mb-5 p-2 text-white uppercase font-bold" 
                to='/nuevo-plato'>Agregar Plato</Link>

                {platos.map(plato =>(
                    <Plato 
                        key={plato.id}
                        plato={plato}
                    />
                ))}
        </>
     );
}
 
export default Menu;