package com.panda.libadjust;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import com.adjust.sdk.AdjustConfig;
import com.adjust.sdk.AdjustEvent;
import com.adjust.sdk.LogLevel;
import com.adjust.sdk.OnDeeplinkResponseListener;
import com.panda.adjust.R;
import com.panda.module.Module;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;


public class Adjust extends Module.ModuleBase implements OnDeeplinkResponseListener {
    @Override
    public int getVersion() {
        return 1;
    }

    public Adjust() {
        super(Module.MODULE_NAME.adjust);
    }

    @Override
    public void init(Activity activity) {
        super.init(activity);
        String appToken = activity.getString(R.string.ADJUST_APP_TOKEN);
        String environment = AdjustConfig.ENVIRONMENT_PRODUCTION;
        AdjustConfig config = new AdjustConfig(getActivity(), appToken, environment);
        config.setLogLevel(LogLevel.VERBOSE); // enable all logs

        // Evaluate the deeplink to be launched.
        config.setOnDeeplinkResponseListener(this);
        com.adjust.sdk.Adjust.onCreate(config);

        //通过深度链接的再归因
        Intent intent = getActivity().getIntent();
        Uri data = intent.getData();
        com.adjust.sdk.Adjust.appWillOpenUrl(data, getActivity().getApplicationContext());
    }

    @Override
    public void onPause() {
        super.onPause();
        com.adjust.sdk.Adjust.onPause();
    }

    @Override
    public void onResume() {
        super.onResume();
        com.adjust.sdk.Adjust.onResume();
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        if(getActivity() != null) {
            //通过深度链接的再归因
            Uri data = intent.getData();
            com.adjust.sdk.Adjust.appWillOpenUrl(data, getActivity().getApplicationContext());
        }
    }

    public void addSessionCallbackParameter(JSONObject params) {
        try {
            String key = params.optString("key");
            String value = params.optString("value");
            com.adjust.sdk.Adjust.addSessionCallbackParameter(key, value);
        }catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void removeSessionCallbackParameter(JSONObject params) {
        try {
            String key = params.optString("key");
            com.adjust.sdk.Adjust.removeSessionCallbackParameter(key);
        }catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void resetSessionCallbackParameters(JSONObject params) {
        try {
            com.adjust.sdk.Adjust.resetSessionCallbackParameters();
        }catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void getAdid(JSONObject params) {
        try {
            JSONObject obj = new JSONObject();
            obj.put("adid",com.adjust.sdk.Adjust.getAdid());
            dispatchEventToScript("onAdid",obj);
        }catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void event(JSONObject params) {
        try {
            String eventToken = params.optString("eventToken",null);
            String currency = params.optString("currency",null);
            String orderId = params.optString("orderId",null);
            String callbackId = params.optString("callbackId",null);
            String callbackStr = params.optString("callbackStr",null);
            AdjustEvent adjustEvent = new AdjustEvent(eventToken);
            if ( currency != null ) {
                double revenue = Double.parseDouble(params.optString("revenue"));
                adjustEvent.setRevenue(revenue, currency);
            }
            if ( orderId != null ) {
                adjustEvent.setOrderId(orderId);
            }
            if ( callbackId != null ) {
                adjustEvent.setCallbackId(callbackId);
            }
            if ( callbackStr != null ) {
                JSONObject jsonObject = new JSONObject(callbackStr);
                Iterator<String> iter = jsonObject.keys();
                while (iter.hasNext()) {
                    String key = iter.next();
                    try {
                        String value = (String)jsonObject.get(key);
                        System.out.println("callback Key = " + key + ", Value = " + value);
                        adjustEvent.addCallbackParameter(key, value);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
            com.adjust.sdk.Adjust.trackEvent(adjustEvent);
            System.out.println("Adjust event end");
        }catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public boolean launchReceivedDeeplink(Uri deeplink) {
        return true;
    }
}
