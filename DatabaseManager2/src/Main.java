import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import java.io.*;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Random;
import java.util.concurrent.TimeUnit;

/**
 * Created by floris-jan on 25-10-16.
 */
public class Main {
    private static int filecount = 1;
    private static Character[] carIDSet = new Character[] {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'};
    private static Character[] dealerIDSet = new Character[] {'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'};
    private static ArrayList<String> excistingDealers = new ArrayList<>();
    private static JSONObject specs;

    public static void main(String args[]) throws IOException, InterruptedException {
        Get.setJSON();
        System.out.println(cypherRawCarData("Car", "VehicleModelYear"));
//        System.out.println(generateCypherDealers(300));
    }

    public static ResultSet getRawData(String table) {
        try {
            final DatabaseReader databaseReader = new DatabaseReader();
            return databaseReader.statement.executeQuery("SELECT * FROM '" + table + "' ORDER BY year DESC");
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static String getID(int value, Character[] characters) {
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
            filecount++;
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    static String readFile(String path, Charset encoding) throws IOException {
        byte[] encoded = Files.readAllBytes(Paths.get(path));
        return new String(encoded, encoding);
    }

    public static String generateCypherDealers(int max) {
        String result = "";
        for (int i = 0; i < max; i++) {
            String id = getID(i, dealerIDSet);
            excistingDealers.add(id);
            String country = Get.Country();
            String keyvalues = cypherKV("name", Get.DealerName()) + "," + cypherKV("country", country) + ", " + cypherKV("city", Get.City(country) + ", " + cypherKV("street", Get.Street()) + ", " + cypherKV("streetnumber", Get.StreetNumber() + "") + ", " + cypherKV("openfrom", Get.OpenFrom()) + ", " + cypherKV("opentill", Get.OpenTill()));
            result = result + toCypher(id, "Dealer", keyvalues);
        }

        return result;
    }

    public static String toCypher(String id, String type, String keyvalues) {
        return "CREATE (" + id + ":" + type + " { " + keyvalues + "});\n";
    }

    public static String cypherKV(String key, String value) {
        return key + ": '" + value + "'";
    }

    public static void downloadImage(String make, String model) {
        String script = "say \"Hallo wereld\"";
        Runtime runtime = Runtime.getRuntime();

        try {
            script = readFile("script.txt", StandardCharsets.UTF_8);
            String[] args = { "osascript", "-e", script, make, model };
            Process process = runtime.exec(args);
            TimeUnit.SECONDS.sleep(3);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    } //Runs the Apple Script with the make and model parameters to download the image

    public static String cypherRawCarData(String type, String table) throws IOException, InterruptedException {
        ResultSet resultSet = getRawData(table);
        String result = "";
        String miliresult = "";
        int count = 0;

        try {
            while(resultSet.next()) {
                Thread.sleep(1000);
                String year = "";
                String make = "";
                String model = "";

                String create = "CREATE (";
                create = create + getID(count, carIDSet) + ":" + type + "{";
                for (int i = 1; i < resultSet.getMetaData().getColumnCount()+1; i++) {
                    create = create + resultSet.getMetaData().getColumnName(i).toString() + ":'" + resultSet.getString(i).toString() + "'";
                    if(i != resultSet.getMetaData().getColumnCount()) {
                        create = create + ", ";
                    }

                    if(resultSet.getMetaData().getColumnName(i).toString().equals("year")) {
                        year = resultSet.getString(i).toString();
                    } else if(resultSet.getMetaData().getColumnName(i).toString().equals("make")) {
                        make = resultSet.getString(i).toString();
                    } else if(resultSet.getMetaData().getColumnName(i).toString().equals("model")) {
                        model = resultSet.getString(i).toString();
                    }
                }

                downloadImage(make, model);

                getSpecs(readJsonFromUrl("http://www.carqueryapi.com/api/0.3/?callback=?&cmd=getTrims&keyword=" + make.toLowerCase() + "%20" + model.toLowerCase() + "&year=" + year));
                Iterator<?> keys = specs.keys();

                create = create + ", price: " + (10000 + new Random().nextInt(80000));
//                create = create + ", picture: " + new ImageCrawler(make + " " + model + " " + year).get();
                while (keys.hasNext()) {
                    String key = (String)keys.next();
                    System.out.println(key.toString() + " - " + specs.get(key).toString());
                    create = create + ", " + key.toString() + ": \'" + specs.get(key).toString() + "\'";
                }

                create = create + "})\n";
                System.out.println(create);
                miliresult = miliresult + create;
                count++;
                System.out.println(count);
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

    private static String readAll(Reader rd) throws IOException {
        StringBuilder sb = new StringBuilder();
        int cp;
        while ((cp = rd.read()) != -1) {
            if((char) cp != '?' && (char) cp != '(' && (char) cp != ')'){
                sb.append((char) cp);
            }
        }
        return sb.toString();
    }

    public static JSONObject readJsonFromUrl(String url) throws IOException, JSONException {
        InputStream is = new URL(url).openStream();
        try {
            BufferedReader rd = new BufferedReader(new InputStreamReader(is, Charset.forName("UTF-8")));
            String jsonText = readAll(rd);
            JSONObject json = new JSONObject(jsonText);
            return json;
        } finally {
            is.close();
        }
    }

    public static void getSpecs(JSONObject input) {
        JSONArray jsonarray = input.getJSONArray("Trims");
        if(!jsonarray.toString().equals("[]")) {
            specs = new JSONObject(jsonarray.get(0).toString());
        }
    }
}
