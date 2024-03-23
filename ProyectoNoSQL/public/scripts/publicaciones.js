    // Función para formatear la fecha en (dd/mm/yyyy)
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Sumamos 1 ya que los meses son indexados desde 0
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    document.addEventListener('DOMContentLoaded', async function () {
        const publicacionesSection = document.getElementById('publicaciones-section');

        // Realizar solicitud al servidor para obtener las publicaciones
        try {
            const response = await fetch('/api/publicaciones');
            const data = await response.json();

            // Verificar si la respuesta contiene datos de las publicaciones
            if (data && data.publicaciones && data.publicaciones.length > 0) {
                // Iterar sobre las publicaciones y crear elementos HTML para cada una
                data.publicaciones.forEach(publicacion => {
                    const postItem = document.createElement('div');
                    postItem.classList.add('post-item');

                    // Formatear la fecha
                    const formattedDate = formatDate(new Date(publicacion.Fecha));

                    // Crear el contenido de la publicación
                    const postHeader = document.createElement('div');
                    postHeader.classList.add('post-header');
                    postHeader.innerHTML = `
                        <img src="${publicacion.Multimedia}" alt="${publicacion.Nombre_usuario}">
                        <h4>${publicacion.Nombre_usuario}</h4>
                        <p>${formattedDate}</p>
                    `;
                    const postContent = document.createElement('div');
                    postContent.classList.add('post-content');
                    postContent.innerHTML = `
                        <p>${publicacion.desc}</p>
                        <img src="${publicacion.Multimedia}" alt="Post Image">
                    `;

                    // Mostrar los comentarios asociados a la publicación
                    const comentariosContainer = document.createElement('div');
                    comentariosContainer.classList.add('comentarios-container');
                    publicacion.comentarios.forEach(comentario => {
                        const comentarioElement = document.createElement('div');
                        comentarioElement.classList.add('comentario');
                        comentarioElement.innerHTML = `
                            <p>${comentario.texto}</p>
                        `;

                        // Mostrar los comentarios secundarios asociados al comentario
                        const comentariosHijoContainer = document.createElement('div');
                        comentariosHijoContainer.classList.add('comentarios-hijo-container');
                        comentario.comentariohijo.forEach(comentarioHijo => {
                            const comentarioHijoElement = document.createElement('div');
                            comentarioHijoElement.classList.add('comentario-hijo');
                            comentarioHijoElement.innerHTML = `
                                <p>${comentarioHijo.texto}</p>
                            `;
                            comentariosHijoContainer.appendChild(comentarioHijoElement);
                        });

                        comentarioElement.appendChild(comentariosHijoContainer);
                        comentariosContainer.appendChild(comentarioElement);
                    });

                    // Agregar el contenido de la publicación al elemento principal
                    postItem.appendChild(postHeader);
                    postItem.appendChild(postContent);
                    postItem.appendChild(comentariosContainer);

                    // Agregar la publicación al área designada en el HTML
                    publicacionesSection.appendChild(postItem);
                });
            } else {
                // Si no hay publicaciones, mostrar un mensaje de que no hay publicaciones disponibles
                publicacionesSection.innerHTML = '<p>No hay publicaciones disponibles.</p>';
            }
        } catch (error) {
            console.error('Error al obtener las publicaciones:', error);
            publicacionesSection.innerHTML = '<p>Ocurrió un error al obtener las publicaciones.</p>';
        }
    });