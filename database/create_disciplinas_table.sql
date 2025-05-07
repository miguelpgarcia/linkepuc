CREATE TABLE Disciplinas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    professor VARCHAR(255),
    horario VARCHAR(255),
    departamento VARCHAR(50),
    creditos INT,
    horas_a_distancia INT,
    shf INT
);
