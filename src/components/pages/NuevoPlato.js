import React, {useContext, useState, Children} from 'react';

 import {useFormik} from 'formik'
 import * as Yup from 'yup';
 import { FirebaseContext } from '../../firebase'
 import {useNavigate} from 'react-router-dom';
 import FileUploader from 'react-firebase-file-uploader'

const NuevoPlato = () => {
    
    // state para las imagenes
    const [subiendo, guardarSubiendo] = useState(false);
    const [progreso, guardarProgreso] = useState(0);
    const [urlimagen, guardarUrlimagen] = useState("");
    
    // Hook para redireccionar 
    const navigate = useNavigate();
    // Context de las operaciones de Firebase
    const {firebase} = useContext(FirebaseContext);
    //console.log(firebase);

    // Validacion y leer los datos del formulario.
    const formik = useFormik({
        initialValues: {
            nombre: '',
            precio: '', 
            categoria: '',
            imagen: '',
            descripcion:'',
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                        .min(3, 'Los platos deben tener al menos 3 caractares.')
                        .required('El nombre del plato es obligatorio.'),
            precio: Yup.number()
                        .min(1, 'Debe agregar un nùmero.')
                        .required('El precio es obligatorio.'),
            categoria: Yup.string()
                        .required('La categoria es obligatorio.'),
            descripcion: Yup.string()
                        .min(10, 'Los La descripcion debe ser mas larga.')
                        .required('La descripcion es obligatorio.'),                                                                        
        }),        
        onSubmit: plato =>{
            //console.log(datos);
            try {
                plato.existencia = true;
                plato.imagen = urlimagen;
                firebase.db.collection('productos').add(plato)
                // Redireccionar
                navigate('/menu');
            } catch (error) {
                console.log(error);   
            }
        }
    });

    // Todo sobre las imagnes
    const handleUploadStart = ()=>{
        guardarProgreso(0);
        guardarSubiendo(true);
    }

    const handleUploadError = error =>{
        guardarSubiendo(false)
        console.log(error)
    }

    const handleUploadSuccess = async nombre => {
        guardarProgreso(100);
        guardarSubiendo(false);

        // Almacenar la URL de destino
        const url = await firebase
                    .storage
                    .ref("productos")
                    .child(nombre)
                    .getDownloadURL();

        console.log(url);
        guardarUrlimagen(url);
    }

    const handleUploadProgress = progreso =>{
        guardarProgreso(progreso)
        
        console.log(progreso);
    }

    return ( 
        <>
            <h1 className="text-3xl font-light mb-4">Agregar Plato</h1>
        
            <div className="flex justify-center mt-10">
                <div className="w-full max-w-3xl">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-4">
                            <label 
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="nombre">Nombre</label>
                            <input 
                                className="shadow appearance-none border rounded w-full px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text" 
                                name="nombre" 
                                id="nombre"
                                placeholder="Nuevo Plato"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                />
                        </div>

                        { 
                            formik.touched.nombre && formik.errors.nombre ? (
                            <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5' role='alert'>
                                <p className="font-bold">Hubo un error</p>
                                <p>{formik.errors.nombre}</p>
                            </div>) : null 
                        }

                        <div className="mb-4">
                            <label 
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="precio">Precio</label>
                            <input 
                                className="shadow appearance-none border rounded w-full px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="number" 
                                name="precio" 
                                id="precio"
                                placeholder="$20"
                                min="0"
                                value={formik.values.precio}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                />
                        </div>

                        { 
                            formik.touched.precio && formik.errors.precio ? (
                            <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5' role='alert'>
                                <p className="font-bold">Hubo un error</p>
                                <p>{formik.errors.precio}</p>
                            </div>) : null 
                        }


                        <div className="mb-4">
                            <label 
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="categoria">Categoria</label>
                            <select className="shadow appearance-none border rounded w-full px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    name="categoria"
                                    id="categoria"
                                    value={formik.values.categoria}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur} >
                                <option value="none">-- Seleccione --</option>
                                <option value="desayuno">Desayuno</option>
                                <option value="comida">Comida</option>
                                <option value="cena">Cena</option>
                                <option value="bebida">Bebidas</option>
                                <option value="postre">Postres</option>
                                <option value="ensalada">Ensaladas</option>
                            </select>
                        </div>

                        { 
                            formik.touched.categoria && formik.errors.categoria ? (
                            <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5' role='alert'>
                                <p className="font-bold">Hubo un error</p>
                                <p>{formik.errors.categoria}</p>
                            </div>) : null 
                        }

                        <div className="mb-4">
                            <label 
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="imagen">Imagen</label>
                            <FileUploader 
                                accept="image/*"
                                id="imagen"
                                name="imagen"
                                randomizeFilename
                                storageRef={firebase.storage.ref("productos")}
                                onUploadStart={handleUploadStart}
                                onUploadError={handleUploadError}
                                onUploadSuccess={handleUploadSuccess}
                                onProgress={handleUploadProgress}
                            />

                        </div>

                        { subiendo && (
                            <div className="h-12 relative w-full border">
                                <div className="bg-green-500 absolute left-0 top-0 text-center text-white px-2 text-sm h-12 flex items-center" style={{width: `${progreso}%`}}>
                                    {progreso} %
                                </div>
                            </div>
                        )}
                        { urlimagen && (
                                <p className="bg-green-500 text-white py-3 text-center my-5">
                                    La imagen subien correctamente
                                </p>
                        )}

                        <div className="mb-4">
                            <label 
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="descripcion">Descripcion</label>
                            <textarea 
                                className="shadow appearance-none border rounded w-full px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40"
                                name="descripcion" 
                                id="descripcion"
                                placeholder="Descripcion del nuevo plato"
                                value={formik.values.descripcion}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                ></textarea>
                        </div>

                        { 
                            formik.touched.descripcion && formik.errors.descripcion ? (
                            <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5' role='alert'>
                                <p className="font-bold">Hubo un error</p>
                                <p>{formik.errors.descripcion}</p>
                            </div>) : null 
                        }
                            <input
                                type="submit"
                                className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold"
                                value="Agregar Plato" 
                            />
                    </form>
                </div>
            </div>
        
        </>
     )
}
 
export default NuevoPlato;