import { useEffect, useState } from "react";
import useProductos from "../../hooks/useProductos.js";
import "./ProductoEditor.css";

/*
  Formulario controlado para editar el producto seleccionado.
*/
const ProductoEditor = () => {
  const { productoEditando, actualizarProducto, limpiarEdicion, cargando } =
    useProductos();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  // Cuando cambia el producto seleccionado, se cargan sus datos en el formulario.
  useEffect(() => {
    if (!productoEditando) {
      setName("");
      setPrice("");
      setWeight("");
      setImageUrl("");
      setDescription("");
    } else {
      setName(productoEditando.name ? productoEditando.name : "");
      setPrice(
        productoEditando.price === null || productoEditando.price === undefined
          ? ""
          : String(productoEditando.price)
      );
      setWeight(
        productoEditando.weight === null || productoEditando.weight === undefined
          ? ""
          : String(productoEditando.weight)
      );
      setImageUrl(productoEditando.image_url ? productoEditando.image_url : "");
      setDescription(productoEditando.description ? productoEditando.description : "");
    }
  }, [productoEditando]);

  const enviar = async (e) => {
    e.preventDefault();

    if (productoEditando) {
      const nombre = name.trim();

      if (nombre !== "") {
        await actualizarProducto(productoEditando.id, {
          name: nombre,
          price: price === "" ? null : Number(price),
          weight: weight === "" ? null : Number(weight),
          image_url: imageUrl.trim() ? imageUrl.trim() : null,
          description: description.trim() ? description.trim() : null,
        });
      }
    }
  };

  if (!productoEditando) {
    return (
      <div className="productoEditorEmpty">
        Selecciona un producto para editarlo.
      </div>
    );
  }

  return (
    <form className="productoEditor" onSubmit={enviar}>
      <div className="bloqueTitle">Editar producto</div>

      <div className="productoEditorInfo">
        Editando: <strong>{productoEditando.name}</strong>
      </div>

      <label>
        Nombre
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={cargando}
        />
      </label>

      <div className="productoEditorFila">
        <label>
          Precio (€)
          <input
            className="input"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={cargando}
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
        />
      </label>

      <label>
        Descripción
        <textarea
          className="input"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={cargando}
        />
      </label>

      <div className="productoEditorAcciones">
        <button className="btn btn--primary" type="submit" disabled={cargando}>
          Actualizar
        </button>

        <button
          className="btn btn--secondary"
          type="button"
          onClick={limpiarEdicion}
          disabled={cargando}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ProductoEditor;
