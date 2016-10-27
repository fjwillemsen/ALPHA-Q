import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;


/**
 * Created by floris-jan on 25-10-16.
 */
public class Main {
    public static int filecount = 1;
    private static ArrayList<String> dealerIDs = new ArrayList<>();
    private static ArrayList<String> companyIDs= new ArrayList<>();
    private static ArrayList<String> carIDs= new ArrayList<>();
    public static void main(String args[]) {
        Character[] carsId = new Character[] {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'};
        Character[] companyId = new Character[] {'K', 'L', 'M', 'O', 'P','Q','R','S','T','U'};
        //System.out.println(cypherRawData("Car", "VehicleModelYear","price", carsId));
        //System.out.println(cypherRawData("Company", "Company",null,companyId));
        List<String> carMakes =getSpecificData("VehicleModelYear","distinct(make)","");
        List<String> compNames =getSpecificData("Company","distinct(name)","");

    }

    public static ResultSet getRawData(String table) {
        try {
            final DatabaseReader databaseReader = new DatabaseReader();
            return databaseReader.statement.executeQuery("SELECT * FROM '" + table + "'");
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }


    public static List<String> getSpecificData(String table, String output, String where) {
        try {
            List<String> result = new ArrayList<>();
            final DatabaseReader databaseReader = new DatabaseReader();
            ResultSet rs = databaseReader.statement.executeQuery("SELECT "+ output +" FROM '" + table + "' "+ where);
            while (rs.next()){
                result.add(rs.getString(1));

            }
            return result;

        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }
    public static String getID(int value, Character[] ids) {

        String result = "";
        String valueChar = value + "";
        for (int i = 0; i < valueChar.length(); i++) {
            result = result + ids[Integer.parseInt(valueChar.charAt(i) + "")];
        }
        return result;
    }

    public static void writeToFile(String filename, String value) {
        try {
            BufferedWriter out = new BufferedWriter(new FileWriter(filename + ".txt"));
            out.write(value);
            out.close();
            filecount++;
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static String cypherRawData(String type, String table, String extra, Character[] ids) {
        ResultSet resultSet = getRawData(table);
        String result = "";
        String miliresult = "";
        int count = 0;
        try {
            while(resultSet.next()) {
                String create = "CREATE (";
                String id = getID(count, ids);
                if(type == "Company") {
                    companyIDs.add(id);
                } else if(type == "Car") {
                    carIDs.add(id);
                }
                create = create + id + ":" + type + "{";
                for (int i = 1; i < resultSet.getMetaData().getColumnCount()+1; i++) {
                    create = create + resultSet.getMetaData().getColumnName(i) + ":'" + resultSet.getString(i) + "'";
                    if(i != resultSet.getMetaData().getColumnCount()) {
                        create = create + ", ";
                    }
                }
                if (extra != null ){
                    create = create + "," + extra +":" + (10000 + new Random().nextInt(80000));
                }
                create = create + "})\n";
                miliresult = miliresult + create;
                count++;
                if(count%1000 == 0) {
                    writeToFile((filecount + ""), miliresult);
                    result = result + miliresult;
                    miliresult = "";
                }
            }
            writeToFile((filecount + ""), miliresult);
            result = result + miliresult;
            miliresult = "";
        } catch (SQLException e) {
            e.printStackTrace();
        }
        System.out.println("# converted: " + count);
        return result;
    }

//    public static String matchNodes(){
//        String resultM = "";
//        String connect = "CREATE (";
//        for (String i: carIDs){
//            connect = connect +
//        }
//        return resultM;
//    }

}
