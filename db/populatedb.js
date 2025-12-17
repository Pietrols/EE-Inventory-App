#! /usr/bin/env node

require("dotenv").config();
const { Client } = require("pg");

const createTables = `
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS disciplines;

-- Disciplines (Categories) Table
CREATE TABLE disciplines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP
);

-- Courses (Items) Table 
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    discipline_id INTEGER REFERENCES disciplines(id) ON DELETE RESTRICT,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    main_content TEXT,
    difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 10),
    rewards INTEGER CHECK (rewards >= 1 AND rewards <= 10),
    rating NUMERIC(2, 1),
    quantity_available INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP
)
`;

const seedData = `
    INSERT INTO disciplines (name, description) VALUES
    ('Power Systems Engineer', 'Specializes in generation, transmission, and distribution of electrical power. Focuses on grid stability and renewable energy integration.'),
    ('Embedded Systems Engineer', 'Expert in microcontrollers, real-time systems, and IoT devices. Combines hardware and software for embedded applications.'),
    ('Protection Engineer', 'Designs protective systems and equipment for electrical grids. Specializes in fault detection and isolation.'),
    ('Electrical Machines Engineer', 'Focuses on design and analysis of motors, generators, and transformers.'),
    ('Automation Engineer', 'Implements control systems and industrial automation. Works with PLCs and SCADA systems.'),
    ('Instrumentation and Control Engineer', 'Designs measurement and feedback systems for process control.'),
    ('Robotics Engineer', 'Develops robotic systems with advanced control algorithms and sensor integration.'),
    ('Renewable Energy Engineer', 'Specializes in solar, wind, and other renewable energy systems.'),
    ('Design Systems Engineer', 'Focuses on PCB design, circuit optimization, and hardware prototyping.'),
    ('Software Engineer', 'Develops firmware, embedded software, and industrial control software.'),
    ('Computer Engineer', 'Works on computer architecture, digital design, and computing systems.'),
    ('Power Electronics Engineer', 'Specializes in power conversion and high-efficiency energy systems.');

    INSERT INTO courses (discipline_id, name, description, main_content, difficulty, rewards, quantity_available) VALUES
    (1, 'Power Systems Fundamentals', 'Introduction to AC power, three-phase systems, and power factor.', 'AC theory, impedance, power calculations', 5, 7, 50),
    (1, 'Electrical Machines I', 'Study of DC and AC motors, generators, and transformers.', 'Motor types, efficiency, torque characteristics', 7, 8, 40),
    (1, 'Power Flow Analysis', 'Load flow studies and power system stability analysis.', 'Newton-Raphson method, contingency analysis', 8, 9, 25),
    (2, 'Microcontrollers and Microprocessors', 'Introduction to ARM, AVR, and PIC architectures.', 'CPU design, instruction sets, memory management', 7, 8, 45),
    (2, 'Embedded C Programming', 'Low-level programming for embedded systems.', 'Memory management, interrupts, timers', 6, 7, 55),
    (2, 'Real-Time Operating Systems', 'Fundamentals of RTOS and task scheduling.', 'Task management, synchronization, scheduling algorithms', 8, 9, 30),
    (3, 'Relay Protection Systems', 'Design and coordination of protective relays.', 'Overcurrent, distance, and differential relays', 7, 8, 35),
    (3, 'Fault Analysis', 'Symmetrical and unsymmetrical fault analysis.', 'Symmetrical components, Z-matrices, fault currents', 8, 9, 20),
    (4, 'DC Machines', 'Detailed analysis of DC motor and generator operation.', 'Commutation, armature reaction, speed control', 6, 7, 32),
    (4, 'AC Machines', 'Comprehensive study of induction and synchronous machines.', 'Slip, torque curves, phasor diagrams', 7, 8, 28),
    (4, 'Transformer Theory and Design', 'Transformer operation, losses, and thermal analysis.', 'Equivalent circuits, cooling systems, impedance', 6, 7, 38),
    (5, 'Industrial Control Systems', 'PLCs, SCADA, and DCS for factory automation.', 'Ladder logic, analog I/O, communication protocols', 7, 8, 42),
    (5, 'Programmable Logic Controllers', 'PLC programming using IEC 61131-3 standard.', 'Structured text, function blocks, state machines', 6, 7, 48),
    (6, 'Process Control', 'Feedback control, PID controllers, and loop tuning.', 'Transfer functions, stability, Bode plots', 7, 8, 36),
    (6, 'Instrumentation Design', 'Sensor selection, signal conditioning, and calibration.', 'Transducers, amplifiers, noise reduction', 6, 7, 44),
    (7, 'Robotics Fundamentals', 'Robot kinematics, dynamics, and trajectory planning.', 'DH parameters, forward/inverse kinematics, motion control', 8, 9, 22),
    (7, 'Robot Vision and Sensing', 'Computer vision and sensor fusion for robotics.', 'Image processing, feature detection, sensor integration', 8, 9, 18),
    (8, 'Solar Energy Systems', 'Photovoltaic systems design and grid integration.', 'Solar cells, inverters, MPPT algorithms', 6, 7, 50),
    (8, 'Wind Energy Systems', 'Wind turbine technology and power generation.', 'Aerodynamics, electrical generators, control systems', 7, 8, 35),
    (8, 'Energy Storage Systems', 'Battery technology, supercapacitors, and thermal storage.', 'Lithium-ion, lead-acid, power electronics conversion', 7, 8, 28),
    (9, 'PCB Design and Layout', 'Schematic capture, routing, and manufacturing considerations.', 'Altium Designer, signal integrity, thermal management', 6, 7, 52),
    (9, 'Analog Circuit Design', 'Op-amp circuits, filters, and signal conditioning.', 'Frequency response, stability, practical design', 6, 7, 40),
    (9, 'Digital Logic Design', 'Combinational and sequential circuit design using HDL.', 'Boolean algebra, state machines, FPGA implementation', 7, 8, 38),
    (10, 'Embedded Systems Programming', 'C/C++ for embedded applications with firmware development.', 'Build systems, debugging, optimization techniques', 7, 8, 46),
    (10, 'Device Drivers Development', 'Kernel space programming and hardware abstraction.', 'Linux drivers, interrupt handling, memory management', 8, 9, 24),
    (11, 'Digital System Design', 'VHDL/Verilog for FPGA and ASIC design.', 'Synthesis, simulation, verification methodologies', 8, 9, 32),
    (11, 'Computer Architecture', 'CPU design, caching, and parallel processing.', 'Pipeline design, branch prediction, performance metrics', 8, 9, 27),
    (12, 'Power Electronics Converters', 'Buck, boost, and buck-boost converter design.', 'Switching analysis, efficiency, thermal design', 7, 8, 41),
    (12, 'Inverter Design and Control', 'Three-phase and single-phase inverter topologies.', 'PWM control, harmonic mitigation, grid synchronization', 8, 9, 34),
    (12, 'High-Power Switching Devices', 'MOSFETs, IGBTs, and thyristors in power circuits.', 'Thermal management, gate drive circuits, protection', 7, 8, 29);
`;

async function setupDatabase() {
  console.log("--- Setting up Database ---");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  try {
    await client.connect();
    await client.query(createTables);
    console.log("Tables created successfully.");
    await client.query(seedData);
    console.log("Database seeded with initial data.");
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    await client.end();
    console.log("Database setup complete.");
  }
}

setupDatabase();
