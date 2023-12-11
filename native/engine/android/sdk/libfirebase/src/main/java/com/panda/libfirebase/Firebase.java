package com.panda.libfirebase;

import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.FirebaseApp;
import com.google.firebase.crashlytics.FirebaseCrashlytics;
import com.google.firebase.messaging.FirebaseMessaging;
import com.panda.module.Module;

import org.json.JSONException;
import org.json.JSONObject;



public class Firebase extends Module.ModuleBase {
    private static String TAG = Firebase.class.getSimpleName();
    public static String token = "";
    @Override
    public int getVersion() {
        return 1;
    }

    public Firebase() {
        super(Module.MODULE_NAME.firebase);
    }

    @Override
    public void initApplication(Application context) {
        super.initApplication(context);
        FirebaseApp.initializeApp(context);
    }

    @Override
    public void init(Activity activity) {
        super.init(activity);
    }

    public void onNewIntent (Intent intent){
        super.onNewIntent(intent);
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    public void getToken(JSONObject params) {
        if ( token == null ) {
            FirebaseMessaging.getInstance().getToken()
                    .addOnCompleteListener(new OnCompleteListener<String>() {
                        @Override
                        public void onComplete(@NonNull Task<String> task) {
                            if (!task.isSuccessful()) {
                                Log.w(TAG, "Fetching FCM registration token failed", task.getException());
                                return;
                            }
                            // Get new FCM registration token
                            String token = task.getResult();
                            Firebase.token = token;
                            Log.d(TAG, "token:"+token);
                            sendTokenEvent(token);
                        }
                    });
        }else {
            sendTokenEvent(token);
        }
    }

    public void subscribeToTopic(JSONObject params) {
        String topic = params.optString("topic");
        FirebaseMessaging.getInstance().subscribeToTopic(topic)
                .addOnCompleteListener(new OnCompleteListener<Void>() {
                    @Override
                    public void onComplete(@NonNull Task<Void> task) {
                        if (!task.isSuccessful()) {
                            Log.d(TAG, "subscribeToTopic fail:" + topic);
                        }else{
                            Log.d(TAG, "subscribeToTopic success:" + topic);
                        }
                    }
                });
    }

    public void unsubscribeFromTopic(JSONObject params) {
        String topic = params.optString("topic");
        FirebaseMessaging.getInstance().unsubscribeFromTopic(topic)
                .addOnCompleteListener(new OnCompleteListener<Void>() {
                    @Override
                    public void onComplete(@NonNull Task<Void> task) {
                        if (!task.isSuccessful()) {
                            Log.d(TAG, "subscribeToTopic fail:" + topic);
                        }else{
                            Log.d(TAG, "subscribeToTopic success:" + topic);
                        }
                    }
                });
    }

    public void sendTokenEvent(String token) {
        Log.w(TAG, "sendTokenEvent:" + token);
        try {
            JSONObject obj = new JSONObject();
            obj.put("token",token);
            dispatchEventToScript("onFireBaseToken",obj);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }

    public void setUserID(JSONObject params) {
        String userID = params.optString("userID");
        FirebaseCrashlytics.getInstance().setUserId(userID);
    }

    public void postException(JSONObject params) {
        try {
            String strError = params.optString("strError");
            String strStack = params.optString("strStack");
            Throwable throwable = new Throwable(strError);
            String[] stackTraceStr = strStack.split("\n");
            StackTraceElement[] stackTrace = new StackTraceElement[stackTraceStr.length];
            for (int i=0;i<stackTraceStr.length;i++) {
                String str = stackTraceStr[i];
                stackTrace[i] = new StackTraceElement("lua1",str,"lua2",0);
            }
            throwable.setStackTrace(stackTrace);
            FirebaseCrashlytics.getInstance().recordException(throwable);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void postException(String reason, String stack) {
        try {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("reason",reason);
            jsonObject.put("stack",stack);
            postException(jsonObject);
        }catch (Exception e) {
            e.printStackTrace();
        }
    }
}
