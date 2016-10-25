import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Random;

/**
 * Created by floris-jan on 25-10-16.
 */
public class Main {

    private static ResultSet resultSet;

    public static void main(String args[]) {
        resultSet = getRawData();
        System.out.println(cypherRawData());
    }

    public static ResultSet getRawData() {
        try {
            final DatabaseReader databaseReader = new DatabaseReader();
            return databaseReader.statement.executeQuery("SELECT * FROM 'VehicleModelYear'");
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static String getID(int value) {
        Character[] characters = new Character[] {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'};
        String result = "";
        String valueChar = value + "";
        for (int i = 0; i < valueChar.length(); i++) {
            result = result + characters[Integer.parseInt(valueChar.charAt(i) + "")];
        }
        return result;
    }

    public static void writeToFile(String filename, String value) {
        try {
            BufferedWriter out = new BufferedWriter(new FileWriter(filename + ".txt"));
            out.write(value);
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static String cypherRawData() {
        String result = "";
        String miliresult = "";
        int count = 0;
        try {
            while(resultSet.next()) {
                String create = "CREATE (";
                create = create + getID(count) + ":Car {";
                for (int i = 1; i < resultSet.getMetaData().getColumnCount()+1; i++) {
                    create = create + resultSet.getMetaData().getColumnName(i).toString() + ":'" + resultSet.getString(i).toString() + "'";
                    if(i != resultSet.getMetaData().getColumnCount()) {
                        create = create + ", ";
                    }
                }
                create = create + ", price:" + (10000 + new Random().nextInt(80000));
                create = create + "})\n";
                miliresult = miliresult + create;
                count++;
                if(count%1000 == 0) {
                    writeToFile((count/1000 + ""), miliresult);
                    result = result + miliresult;
                    miliresult = "";
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        System.out.println("# converted: " + count);
        return result;
    }
}
