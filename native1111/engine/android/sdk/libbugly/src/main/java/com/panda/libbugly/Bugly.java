package com.panda.libbugly;

import android.app.Activity;

import com.panda.module.Module;
import com.tencent.bugly.crashreport.CrashReport;

import org.json.JSONObject;


public class Bugly extends Module.ModuleBase {
    @Override
    public int getVersion() {
        return 1;
    }

    public Bugly() {
        super(Module.MODULE_NAME.bugly);
    }

    @Override
    public void init(Activity activity) {
        super.init(activity);
        String APPID = activity.getString(R.string.BUGLY_APPID);
        String myChannel = activity.getString(R.string.BUGLY_APP_CHANNEL);
        boolean ENABLE_DEBUG = activity.getResources().getBoolean(R.bool.BUGLY_ENABLE_DEBUG);
        CrashReport.UserStrategy strategy = new CrashReport.UserStrategy(activity);
        //...在这里设置strategy的属性，在bugly初始化时传入
        strategy.setAppChannel(myChannel);  //设置渠道
        CrashReport.initCrashReport(activity, APPID, ENABLE_DEBUG, strategy);
    }

    public void setUserId(JSONObject params) {
        String strID = params.optString("user_id");
        CrashReport.setUserId(strID);
    }

    public void postException(JSONObject params) {
        String strError = params.optString("reason");
        String strStack = params.optString("stack");
        CrashReport.postException(6, "error", strError, strStack, null);
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
