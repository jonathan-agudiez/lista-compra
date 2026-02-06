import { useState } from "react";
import useProductos from "../../hooks/useProductos.js";
import "./ProductoCrear.css";

/*
  Formulario controlado para crear un producto.
*/
const ProductoCrear = () => {
  const { crearProducto, cargando } = useProductos();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const enviar = async (e) => {
    e.preventDefault();

    const nombre = name.trim();

    if (nombre !== "") {
      await crearProducto({
        name: nombre,
        price: price === "" ? null : Number(price),
        weight: weight === "" ? null : Number(weight),
        image_url: imageUrl.trim() ? imageUrl.trim() : null,
        description: description.trim() ? description.trim() : null,
      });

      setName("");
      setPrice("");
      setWeight("");
      setImageUrl("");
      setDescription("");
    }
  };

  return (
    <form className="productoCrear" onSubmit={enviar}>
      <div className="bloqueTitle">Crear producto</div>

      <label>
        Nombre
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={cargando}
          placeholder="Ej: Leche"
        />
      </label>

      <div className="productoCrearFila">
        <label>
          Precio (€)
          <input
            className="input"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={cargando}
            placeholder="Ej: 1.20"
          />
        </label>

        <label>
          Peso (g)
          <input
            className="input"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            disabled={cargando}
            placeholder="Ej: 500"
          />
        </label>
      </div>

      <label>
        Imagen (URL)
        <input
          className="input"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          disabled={cargando}
          placeholder="https://..."
        />
      </label>

      <label>
        Descripción
        <textarea
          className="input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={cargando}
          placeholder="Opcional"
          rows={3}
        />
      </label>

      <button className="btn btn--primary" type="submit" disabled={cargando}>
        Guardar
      </button>
    </form>
  );
};

export default ProductoCrear;
