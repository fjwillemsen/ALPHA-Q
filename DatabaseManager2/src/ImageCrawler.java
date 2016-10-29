import java.net.URI;

import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClients;

import java.net.URLEncoder;

/**
 * Created by floris-jan on 27-10-16.
 */
public class ImageCrawler {

    private static String result;

    public ImageCrawler(String search) {

        HttpClient httpclient = HttpClients.createDefault();

        try
        {
            String url = "https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=" + URLEncoder.encode(search, "UTF-8");

            URIBuilder builder = new URIBuilder(url);
            URI uri = builder.build();

            HttpPost request = new HttpPost(uri);
            request.setHeader("Content-Type", "multipart/form-data");
            request.setHeader("Ocp-Apim-Subscription-Key", "188be239af354b259b383c1745571cfd");

            // Request body
            StringEntity reqEntity = new StringEntity("{body}");
            request.setEntity(reqEntity);

            HttpResponse response = httpclient.execute(request);
            HttpEntity entity = response.getEntity();

            if (entity != null)
            {
                JSONObject object = new JSONObject(EntityUtils.toString(entity));
                JSONArray array = object.getJSONArray("value");

                JSONObject jsonObject = array.getJSONObject(0);
                result = jsonObject.getString("contentUrl");
                System.out.println(search + " - " + result);

//                for(int i=0; i<array.length(); i++){
//                    JSONObject jsonObj  = array.getJSONObject(i);
//                    System.out.println(jsonObj.getString("contentUrl"));
//                }
            }
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }
    }

    public String get() {
        return result;
    }
}
