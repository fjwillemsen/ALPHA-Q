import org.apache.commons.io.IOUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Random;
import java.util.Scanner;

/**
 * Created by floris-jan on 17-10-16.
 */

public class Get {

    public static Long seed;
    public static int maxEmployees = 12345;
    public static int maxAddresses = 50;
    public static int maxBuildings = 50;
    public static int maxDegrees = 50;
    public static int maxPositions = 50;
    public static int maxProjects = 100;

    static JSONArray ssns = new JSONArray();
    static JSONArray addresses = new JSONArray();
    static JSONArray positions = new JSONArray();

    static JSONArray lastnames;
    static JSONArray firstnames;
    static JSONObject countriescities;
    static JSONArray universities;
    static JSONArray courses;
    static JSONArray occupations;

    Get() {
        setJSON();
    }

    public static void setJSON() {
        try {
            InputStream namesInputStream = new FileInputStream("names.json");
            InputStream firstNamesInputStream = new FileInputStream("first-names.json");
            InputStream countriescitiesInputStream = new FileInputStream("countriesandcities.json");
            InputStream universitiesInputStream = new FileInputStream("universities.json");
            InputStream coursesInputStream = new FileInputStream("courses.json");
            InputStream positionsInputStream = new FileInputStream("occupations.json");

            String jsonNamesText = IOUtils.toString(namesInputStream);
            String jsonFirstNamesText = IOUtils.toString(firstNamesInputStream);
            String jsonCountriesCitiesText = IOUtils.toString(countriescitiesInputStream);
            String jsonUniversitiesText = IOUtils.toString(universitiesInputStream);
            String jsonCoursesText = IOUtils.toString(coursesInputStream);
            String jsonPositionsText = IOUtils.toString(positionsInputStream);

            lastnames = new JSONArray(jsonNamesText);
            firstnames = new JSONArray(jsonFirstNamesText);
            countriescities = new JSONObject(jsonCountriesCitiesText);
            universities = new JSONArray(jsonUniversitiesText);
            courses = new JSONArray(jsonCoursesText);
            occupations = new JSONArray(jsonPositionsText);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static Random getRandom() {
        Random random;
        if(seed != null) {
            random = new Random(seed);
        } else {
            random = new Random();
        }
        return random;
    }

    public static String Name(String value) {
        String name = "";
        if(value == "firstname") {
            name = firstnames.getString(getRandom().nextInt(firstnames.length()));
        }
        if(value == "lastname") {
            name = lastnames.getString(getRandom().nextInt(lastnames.length()));
        }
        return name;
    }

    public static String SSN() {
        String ssn = (100 + getRandom().nextInt(900)) + "";
        ssn = ssn + "-" + (10 + getRandom().nextInt(90));
        ssn = ssn + "-" + (1000 + getRandom().nextInt(9000));
        ssns.put(ssn);
        return ssn;
    }

    public static String ExcistingSSN() {
        return ssns.getString(getRandom().nextInt(ssns.length()));
    }

    public static int AddressID() {
        int random = getRandom().nextInt(maxAddresses);
        addresses.put(random);
        return random;
    }

    public static int ExcistingAddressID() {
        return addresses.getInt(getRandom().nextInt(addresses.length()));
    }

    public static String Country() {
        int random = getRandom().nextInt(countriescities.length());
        return countriescities.names().getString(random);
    }

    public static String City(String value) {
        int random = getRandom().nextInt(countriescities.getJSONArray(value).length());
        return countriescities.getJSONArray(value).getString(random);
    }

    public static String Street() {
        return Name("lastname") + " Street";
    }

    public static int StreetNumber() {
        return getRandom().nextInt(200);
    }

    public static String ZipCode() {
        String string = "";
        int random = 1000 + getRandom().nextInt(14000);
        if(random>9999) {
            string = random + "" + getRandom().nextInt(9);
        } else {
            char[] alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().toCharArray();
            string = random + "" + alphabet[getRandom().nextInt(alphabet.length)] + "" + alphabet[getRandom().nextInt(alphabet.length)];
        }
        return string;
    }

    public static String DealerName()  {
        return firstnames.get(getRandom().nextInt(firstnames.length())) + "'s Dealership";
    }

    public static int NumberOfRooms() {
        return getRandom().nextInt(1000);
    }

    public static int Rent(int value) {
        return value * (100 + getRandom().nextInt(600));
    }

    public static String Course() {
        return courses.getString(getRandom().nextInt(courses.length()));
    }

    public static String University() {
        return universities.getJSONObject(getRandom().nextInt(universities.length())).getString("name");
    }

    public static String Level() {
        int chance = getRandom().nextInt(3);
        if(chance==0) {
            return "Bachelor";
        } else if(chance==1) {
            return "Master";
        } else {
            return "PhD";
        }
    }

    public static String Position() {
        String position = occupations.getString(getRandom().nextInt(occupations.length()));
        positions.put(position);
        return position;
    }

    public static String ExcistingPositions() {
        return positions.getString(getRandom().nextInt(positions.length()));
    }

    public static int HourFee() {
        return 10 + getRandom().nextInt(150);
    }

    public static int BuildingID() {
        return getRandom().nextInt(maxBuildings);
    }

    public static int AllocatedHours() {
        return 10 + getRandom().nextInt(900);
    }

    public static int Budget() {
        return getRandom().nextInt(10000);
    }

    public static int HoursWorked() {
        return getRandom().nextInt(30);
    }

    public static int ExcistingProjects() {
        return getRandom().nextInt(maxProjects);
    }

    public static String OpeningTimes() {
        return (8 + getRandom().nextInt(5)) + ":00 - "+ (16 + getRandom().nextInt(8)) + ":00";
    }

    public static String OpenFrom() {
        return (8 + getRandom().nextInt(5)) + ":00";
    }

    public static String OpenTill() {
        return (16 + getRandom().nextInt(8)) + ":00";
    }
}
