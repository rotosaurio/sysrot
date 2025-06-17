import * as React from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useState } from 'react';

export default function AnimacionesExample(): React.ReactElement {
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState(0);
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true });

  // Animación cuando el elemento entra en vista
  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      rotateY: -90
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="container mx-auto py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Ejemplos de Animaciones</h1>
        <p className="text-muted-foreground text-lg">
          Showcase de animaciones usando <strong>Framer Motion</strong> con diferentes efectos y transiciones.
        </p>
      </div>

      {/* Sección 1: Animaciones básicas */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold mb-6">1. Animaciones Básicas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Fade In */}
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-xl font-semibold mb-2">Fade In</h3>
            <p className="text-muted-foreground">Aparición gradual con opacidad</p>
          </motion.div>

          {/* Slide In */}
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-2">Slide In</h3>
            <p className="text-muted-foreground">Deslizamiento desde la izquierda</p>
          </motion.div>

          {/* Scale In */}
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold mb-2">Scale In</h3>
            <p className="text-muted-foreground">Escalado desde cero</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Sección 2: Hover Effects */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">2. Efectos Hover</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <motion.div
              key={item}
              className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-lg text-white cursor-pointer"
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-2">Card {item}</h3>
              <p className="text-blue-100">Hover para ver el efecto</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sección 3: Animaciones con estado */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">3. Animaciones Interactivas</h2>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-4">Botón Animado</h3>
              <motion.button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsVisible(!isVisible)}
                animate={{ 
                  backgroundColor: isVisible ? "#10B981" : "#2563EB"
                }}
                transition={{ duration: 0.3 }}
              >
                {isVisible ? "Ocultar" : "Mostrar"} Elemento
              </motion.button>
              
              <motion.div
                className="mt-4 p-4 bg-green-100 dark:bg-green-900/20 rounded-lg"
                initial={false}
                animate={{ 
                  opacity: isVisible ? 1 : 0,
                  height: isVisible ? "auto" : 0,
                  marginTop: isVisible ? 16 : 0
                }}
                transition={{ duration: 0.3 }}
                style={{ overflow: "hidden" }}
              >
                <p className="text-green-800 dark:text-green-200">
                  ¡Elemento animado apareció! 🎉
                </p>
              </motion.div>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-4">Contador Animado</h3>
              <div className="flex items-center gap-4">
                <motion.button
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCount(count - 1)}
                >
                  -
                </motion.button>
                
                <motion.div
                  className="text-4xl font-bold w-16 text-center"
                  key={count}
                  initial={{ scale: 1.5, color: "#10B981" }}
                  animate={{ scale: 1, color: "#000000" }}
                  transition={{ duration: 0.3 }}
                >
                  {count}
                </motion.div>
                
                <motion.button
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCount(count + 1)}
                >
                  +
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 4: Staggered Animations */}
      <motion.section 
        className="mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl font-bold mb-6">4. Animaciones Escalonadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <motion.div
              key={item}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
              variants={itemVariants}
            >
              <div className="w-12 h-12 bg-blue-500 rounded-full mb-4 flex items-center justify-center text-white font-bold">
                {item}
              </div>
              <h3 className="text-lg font-semibold mb-2">Item {item}</h3>
              <p className="text-muted-foreground">Animación escalonada</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Sección 5: Scroll Animations */}
      <motion.section 
        ref={ref}
        className="mb-16"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <h2 className="text-2xl font-bold mb-6">5. Animaciones en Scroll</h2>
        <p className="text-muted-foreground mb-8">
          Estas tarjetas se animan cuando entran en la vista del usuario.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <motion.div
              key={item}
              className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 rounded-lg text-white"
              variants={cardVariants}
            >
              <h3 className="text-2xl font-bold mb-4">Card en Scroll {item}</h3>
              <p className="text-purple-100">
                Esta tarjeta se animó cuando entró en la vista del scroll.
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Sección 6: Loading Animation */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">6. Animación de Carga</h2>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <div className="flex items-center justify-center">
            <motion.div
              className="flex space-x-2"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    repeat: Infinity,
                    repeatDelay: 1
                  }
                }
              }}
            >
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-4 h-4 bg-blue-500 rounded-full"
                  variants={{
                    hidden: { scale: 0, opacity: 0 },
                    visible: {
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      transition: {
                        duration: 0.6,
                        ease: "easeInOut"
                      }
                    }
                  }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Información adicional */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h3 className="font-semibold mb-4">Características de Framer Motion:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <ul className="space-y-2">
              <li>✅ Animaciones declarativas</li>
              <li>✅ Spring physics naturales</li>
              <li>✅ Animaciones en scroll</li>
              <li>✅ Gesture recognition</li>
            </ul>
          </div>
          <div>
            <ul className="space-y-2">
              <li>✅ Layout animations automáticas</li>
              <li>✅ SVG path animations</li>
              <li>✅ Staggered children</li>
              <li>✅ Performance optimizada</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 