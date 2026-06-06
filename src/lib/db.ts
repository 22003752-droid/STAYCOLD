import mysql from 'mysql2/promise';

// Configuración de la conexión a la base de datos
// Usa DATABASE_URL si está disponible (la forma más fácil), o las variables individuales
const connectionString = process.env.DATABASE_URL || process.env.MYSQL_URL;

const pool = connectionString 
  ? mysql.createPool(connectionString)
  : mysql.createPool({
      host: process.env.DB_HOST || process.env.MYSQLHOST || process.env.MYSQL_HOST || 'localhost',
      user: process.env.DB_USER || process.env.MYSQLUSER || process.env.MYSQL_USER || 'root',
      password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || '',
      database: process.env.DB_NAME || process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'staycold_db',
      port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || process.env.MYSQL_PORT || '3306'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

export default pool;
