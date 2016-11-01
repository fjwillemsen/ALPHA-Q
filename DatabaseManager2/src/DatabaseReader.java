/**
 * Created by floris-jan on 23-06-16.
 */

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class DatabaseReader {
    static final String DB_URL = "jdbc:sqlite:DatabaseManager2/libs/datasource.db";
    Connection connection;
    Statement statement;

    public DatabaseReader() {
        try {
            Class.forName("org.sqlite.JDBC");
            connection = DriverManager.getConnection(DB_URL);
            statement = connection.createStatement();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}