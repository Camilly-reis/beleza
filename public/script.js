console.log("Beleza que Acolhe carregado");

// Contador de visitas

let visitas = localStorage.getItem("visitas");

if(!visitas){
    visitas = 0;
}

visitas++;

localStorage.setItem("visitas", visitas);

console.log("Visitas:", visitas);