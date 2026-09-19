// ============================================================
// MÉTODO DE ELIMINACIÓN - Sistema de ecuaciones lineales 2x2
//
//   a1x + b1y = c1
//   a2x + b2y = c2
//
// Idea del método: sumar o restar las ecuaciones para que una
// variable (aquí la x) desaparezca y nos quede una ecuación
// con una sola incógnita.
// ============================================================


// ------------------------------------------------------------
// VARIABLES GLOBALES
// "let" crea una variable cuyo valor se puede cambiar después.
// Estas dos están fuera de las funciones para que todas
// las funciones puedan usarlas.
// ------------------------------------------------------------

// Aquí vamos guardando el texto HTML de todos los pasos.
let pasos = "";

// Aquí llevamos la cuenta del número de paso (Paso 1, Paso 2, ...).
let numeroPaso = 1;


// ------------------------------------------------------------
// FUNCIÓN: redondear
// Qué hace: recibe un número y lo devuelve con máximo 4 decimales.
// Para qué sirve: para que en pantalla no aparezcan números
// como 1.4285714285714286, sino 1.4286.
// ------------------------------------------------------------
function redondear(numero) {
  // Math.round() redondea un número al entero más cercano.
  // Multiplicamos por 10000, redondeamos y dividimos entre 10000
  // para conservar solamente 4 decimales.
  const resultado = Math.round(numero * 10000) / 10000;

  // "return" devuelve el resultado a quien llamó a la función.
  return resultado;
}


// ------------------------------------------------------------
// FUNCIÓN: escribirEcuacion
// Qué hace: recibe a, b y c y devuelve la ecuación como texto.
// Ejemplo: escribirEcuacion(2, -1, 6) devuelve "2x - 1y = 6".
// Para qué sirve: para mostrar las ecuaciones en cada paso
// sin repetir el mismo código muchas veces.
// ------------------------------------------------------------
function escribirEcuacion(a, b, c) {
  // Empezamos el texto con la parte de la x.
  let texto = redondear(a) + "x";

  // Si b es positivo (o cero) ponemos "+", si es negativo ponemos "-".
  if (b >= 0) {
    texto = texto + " + " + redondear(b) + "y";
  } else {
    texto = texto + " - " + redondear(-b) + "y";
  }

  // Agregamos el "= c" al final.
  texto = texto + " = " + redondear(c);

  return texto;
}


// ------------------------------------------------------------
// FUNCIÓN: agregarPaso
// Qué hace: agrega un paso nuevo (título, explicación y cálculo)
// a la variable "pasos".
// Para qué sirve: para no repetir el mismo bloque de HTML
// cada vez que queremos mostrar un paso.
// ------------------------------------------------------------
function agregarPaso(titulo, explicacion, calculo) {
  // Con "+" vamos pegando pedazos de texto HTML uno tras otro.
  pasos = pasos + "<div class='paso'>";
  pasos = pasos + "<h3>Paso " + numeroPaso + ": " + titulo + "</h3>";
  pasos = pasos + "<p>" + explicacion + "</p>";
  pasos = pasos + "<p class='calculo'>" + calculo + "</p>";
  pasos = pasos + "</div>";

  // Sumamos 1 para que el siguiente paso tenga el número siguiente.
  numeroPaso = numeroPaso + 1;
}


// ------------------------------------------------------------
// FUNCIÓN: mostrarPasos
// Qué hace: escribe en la página todo el texto guardado en "pasos".
// ------------------------------------------------------------
function mostrarPasos() {
  // document.getElementById("resultado") busca en la página el
  // elemento que tiene id="resultado" (el <div> vacío del HTML).
  // .innerHTML es el contenido HTML de ese elemento; al igualarlo
  // a "pasos" lo reemplazamos por nuestros pasos.
  document.getElementById("resultado").innerHTML = pasos;
}


// ------------------------------------------------------------
// FUNCIÓN: mostrarError
// Qué hace: muestra un mensaje de error en rojo en la página.
// Para qué sirve: avisar al usuario cuando falta un dato.
// ------------------------------------------------------------
function mostrarError(mensaje) {
  document.getElementById("resultado").innerHTML =
    "<div class='error'>" + mensaje + "</div>";
}


// ------------------------------------------------------------
// FUNCIÓN PRINCIPAL: resolver
// Qué hace: toma los valores escritos por el usuario, aplica el
// método de eliminación y muestra el procedimiento y el resultado.
// Se ejecuta cuando el usuario presiona el botón "Resolver".
// ------------------------------------------------------------
function resolver() {

  // Antes de empezar, borramos los pasos de la vez anterior.
  pasos = "";
  numeroPaso = 1;

  // ---------- 1. LEER LOS DATOS ----------

  // document.getElementById("a1") busca el campo con id="a1".
  // .value es el texto que el usuario escribió en ese campo.
  // parseFloat() convierte ese texto en un número (acepta decimales).
  const a1 = parseFloat(document.getElementById("a1").value);
  const b1 = parseFloat(document.getElementById("b1").value);
  const c1 = parseFloat(document.getElementById("c1").value);
  const a2 = parseFloat(document.getElementById("a2").value);
  const b2 = parseFloat(document.getElementById("b2").value);
  const c2 = parseFloat(document.getElementById("c2").value);

  // isNaN() responde "true" si el valor NO es un número
  // (por ejemplo, si el campo estaba vacío).
  // El símbolo || significa "o": basta con que un campo esté vacío.
  if (isNaN(a1) || isNaN(b1) || isNaN(c1) || isNaN(a2) || isNaN(b2) || isNaN(c2)) {
    mostrarError("Faltan datos. Escribe un número en los seis campos.");
    return; // "return" sin valor termina la función aquí mismo.
  }

  // ---------- 2. MOSTRAR LAS ECUACIONES ----------

  agregarPaso(
    "Ecuaciones ingresadas",
    "Este es el sistema que vamos a resolver:",
    "Ecuación 1: " + escribirEcuacion(a1, b1, c1) + "<br>" +
    "Ecuación 2: " + escribirEcuacion(a2, b2, c2)
  );

  // ---------- 3. REVISAR QUE HAYA UNA SOLUCIÓN ÚNICA ----------

  // Si a1*b2 - a2*b1 vale 0, las ecuaciones son rectas paralelas
  // o son la misma recta, y no hay una única solución.
  // Math.abs() quita el signo negativo de un número (valor absoluto).
  // Comparamos con 0.0001 (y no con 0) para evitar errores de decimales.
  const determinante = a1 * b2 - a2 * b1;

  if (Math.abs(determinante) < 0.0001) {
    agregarPaso(
      "El sistema no tiene una única solución",
      "Al eliminar una variable, la otra también desaparece. Esto pasa cuando las rectas son paralelas (no hay solución) o cuando son la misma recta (hay infinitas soluciones).",
      ""
    );
    mostrarPasos();
    return;
  }

  // Aquí guardaremos los resultados. Empiezan en 0 y cambian más abajo.
  let x = 0;
  let y = 0;

  // ---------- 4. ELIMINAR LA VARIABLE x ----------

  // "if" significa "si". && significa "y" (las dos cosas deben cumplirse).
  // !== significa "es diferente de".
  // Caso normal: a1 y a2 son distintos de 0.
  if (a1 !== 0 && a2 !== 0) {

    // Multiplicamos la ecuación 1 por a2 (todos sus términos).
    const nueva1a = redondear(a1 * a2);
    const nueva1b = redondear(b1 * a2);
    const nueva1c = redondear(c1 * a2);

    agregarPaso(
      "Multiplicar la ecuación 1",
      "Para eliminar x necesitamos que tenga el mismo coeficiente en las dos ecuaciones. Multiplicamos toda la ecuación 1 por " + a2 + " (el coeficiente de x de la ecuación 2).",
      "(" + escribirEcuacion(a1, b1, c1) + ") × " + a2 + "<br>" +
      "Queda: " + escribirEcuacion(nueva1a, nueva1b, nueva1c)
    );

    // Multiplicamos la ecuación 2 por a1 (todos sus términos).
    const nueva2a = redondear(a2 * a1);
    const nueva2b = redondear(b2 * a1);
    const nueva2c = redondear(c2 * a1);

    agregarPaso(
      "Multiplicar la ecuación 2",
      "Ahora multiplicamos toda la ecuación 2 por " + a1 + " (el coeficiente de x de la ecuación 1).",
      "(" + escribirEcuacion(a2, b2, c2) + ") × " + a1 + "<br>" +
      "Queda: " + escribirEcuacion(nueva2a, nueva2b, nueva2c)
    );

    // Restamos las dos ecuaciones nuevas: (ecuación 1) - (ecuación 2).
    // Como la x tiene el mismo coeficiente en ambas, se cancela.
    const coeficienteY = redondear(nueva1b - nueva2b);
    const numeroSolo = redondear(nueva1c - nueva2c);

    agregarPaso(
      "Restar las ecuaciones y eliminar x",
      "Las dos ecuaciones nuevas tienen " + nueva1a + "x, así que al restarlas la x desaparece. Restamos término con término: ecuación 1 menos ecuación 2.",
      "x: " + nueva1a + " - " + nueva2a + " = 0 (¡la x se eliminó!)<br>" +
      "y: " + nueva1b + " - (" + nueva2b + ") = " + coeficienteY + "<br>" +
      "números: " + nueva1c + " - (" + nueva2c + ") = " + numeroSolo + "<br>" +
      "Nos queda: " + coeficienteY + "y = " + numeroSolo
    );

    // Despejamos y: dividimos entre el número que acompaña a la y.
    y = numeroSolo / coeficienteY;

    agregarPaso(
      "Encontrar y",
      "Ahora solo hay una incógnita. Para despejar y dividimos ambos lados entre " + coeficienteY + ".",
      "y = " + numeroSolo + " ÷ " + coeficienteY + "<br>" +
      "y = " + redondear(y)
    );

  } else if (a1 === 0) {
    // Caso especial: la ecuación 1 no tiene x (a1 vale 0).
    // === significa "es igual a".
    agregarPaso(
      "Eliminar x",
      "En la ecuación 1 el coeficiente de x es 0, así que la x ya no aparece ahí. No hace falta multiplicar ni restar: la ecuación 1 ya tiene solo y.",
      b1 + "y = " + c1
    );

    y = c1 / b1;

    agregarPaso(
      "Encontrar y",
      "Para despejar y dividimos ambos lados entre " + b1 + ".",
      "y = " + c1 + " ÷ " + b1 + "<br>" +
      "y = " + redondear(y)
    );

  } else {
    // Caso especial: la ecuación 2 no tiene x (a2 vale 0).
    agregarPaso(
      "Eliminar x",
      "En la ecuación 2 el coeficiente de x es 0, así que la x ya no aparece ahí. No hace falta multiplicar ni restar: la ecuación 2 ya tiene solo y.",
      b2 + "y = " + c2
    );

    y = c2 / b2;

    agregarPaso(
      "Encontrar y",
      "Para despejar y dividimos ambos lados entre " + b2 + ".",
      "y = " + c2 + " ÷ " + b2 + "<br>" +
      "y = " + redondear(y)
    );
  }

  // ---------- 5. REEMPLAZAR y PARA ENCONTRAR x ----------

  // Elegimos una de las ecuaciones ORIGINALES que sí tenga x.
  // Normalmente usamos la ecuación 1; si su a1 es 0, usamos la 2.
  let aUsada = a1;
  let bUsada = b1;
  let cUsada = c1;
  let numeroEcuacion = 1;

  if (a1 === 0) {
    aUsada = a2;
    bUsada = b2;
    cUsada = c2;
    numeroEcuacion = 2;
  }

  agregarPaso(
    "Reemplazar y en una ecuación",
    "Ya sabemos que y = " + redondear(y) + ". Lo reemplazamos en la ecuación " + numeroEcuacion + " original para que solo quede la incógnita x.",
    "Ecuación " + numeroEcuacion + ": " + escribirEcuacion(aUsada, bUsada, cUsada) + "<br>" +
    "Reemplazando: " + aUsada + "x + (" + bUsada + ") × (" + redondear(y) + ") = " + cUsada
  );

  // Hacemos las operaciones para despejar x.
  const productoBY = bUsada * y;         // primero la multiplicación
  const restoC = cUsada - productoBY;    // pasamos ese número al otro lado
  x = restoC / aUsada;                   // dividimos entre el número de la x

  agregarPaso(
    "Encontrar x",
    "Primero hacemos la multiplicación. Luego pasamos ese número al otro lado restando y, por último, dividimos entre " + aUsada + ".",
    "(" + bUsada + ") × (" + redondear(y) + ") = " + redondear(productoBY) + "<br>" +
    aUsada + "x + (" + redondear(productoBY) + ") = " + cUsada + "<br>" +
    aUsada + "x = " + cUsada + " - (" + redondear(productoBY) + ") = " + redondear(restoC) + "<br>" +
    "x = " + redondear(restoC) + " ÷ " + aUsada + "<br>" +
    "x = " + redondear(x)
  );

  // ---------- 6. SOLUCIÓN FINAL ----------

  pasos = pasos + "<div class='solucion'>";
  pasos = pasos + "<h3>Solución final</h3>";
  pasos = pasos + "<p>x = " + redondear(x) + "</p>";
  pasos = pasos + "<p>y = " + redondear(y) + "</p>";
  pasos = pasos + "</div>";
  pasos = pasos + "<p class='nota'>Los valores se muestran redondeados a 4 decimales, por eso algunas operaciones pueden diferir en la última cifra.</p>";

  // Escribimos todo en la página.
  mostrarPasos();
}
