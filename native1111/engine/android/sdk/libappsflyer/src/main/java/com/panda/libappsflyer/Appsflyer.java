package com.panda.libappsflyer;

import android.app.Activity;
import android.app.Application;
import android.util.Log;

import com.appsflyer.AppsFlyerConversionListener;
import com.appsflyer.AppsFlyerLib;
import com.panda.appsflyer.R;
import com.panda.module.Module;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;


public class Appsflyer extends Module.ModuleBase implements AppsFlyerConversionListener {
    @Override
    public int getVersion() {
        return 1;
    }

    public Appsflyer() {
        super(Module.MODULE_NAME.appsflyer);
    }

    @Override
    public void initApplication(Application context) {
        super.initApplication(context);
        String AF_DEV_KEY = context.getString(R.string.AF_DEV_KEY);
        AppsFlyerLib.getInstance().init(AF_DEV_KEY, this, context);
    }

    @Override
    public void init(Activity activity) {
        super.init(activity);
        AppsFlyerLib.getInstance().start(activity);
    }

    public void event(JSONObject params) {
        try {
            //interface AFInAppEventType
            //interface AFInAppEventParameterName
            String AFInAppEventType = params.optString("AFInAppEventType");
            String AFInAppEventTypeEventValue = params.optString("AFInAppEventTypeEventValue");
            Map<String, Object> eventValue = new HashMap<String, Object>();

            JSONObject jsonObject = new JSONObject(AFInAppEventTypeEventValue);
            Iterator<String> iter = jsonObject.keys();
            while (iter.hasNext()) {
                String key = iter.next();
                try {
                    Object value = jsonObject.get(key);
                    System.out.println("AFInAppEventTypeEventValue Key = " + key + ", Value = " + value);
                    eventValue.put(key,value);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
            AppsFlyerLib.getInstance().logEvent(getActivity() , AFInAppEventType , eventValue);

            System.out.println("ModuleAppsflyer event end");
        }catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onConversionDataSuccess(Map<String, Object> conversionData) {

        for (String attrName : conversionData.keySet()) {
            Log.d("ModuleAppsflyer", "attribute: " + attrName + " = " + conversionData.get(attrName));
        }
    }

    @Override
    public void onConversionDataFail(String errorMessage) {
        Log.d("ModuleAppsflyer", "error getting conversion data: " + errorMessage);
    }

    @Override
    public void onAppOpenAttribution(Map<String, String> attributionData) {
        for (String attrName : attributionData.keySet()) {
            Log.d("ModuleAppsflyer", "attribute: " + attrName + " = " + attributionData.get(attrName));
        }
    }

    @Override
    public void onAttributionFailure(String errorMessage) {
        Log.d("ModuleAppsflyer", "error onAttributionFailure : " + errorMessage);
    }
}
