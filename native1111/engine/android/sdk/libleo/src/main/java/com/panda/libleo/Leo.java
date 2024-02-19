package com.panda.libleo;

import android.Manifest;
import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Log;

import com.android.cardsdk.sdklib.ActionListener;
import com.android.cardsdk.sdklib.CommonInfoResultListener;
import com.android.cardsdk.sdklib.OnPushClickListener;
import com.android.cardsdk.sdklib.OnShareUIResUpdateListener;
import com.android.cardsdk.sdklib.SDK;
import com.android.cardsdk.sdklib.ShareCallback;
import com.android.cardsdk.sdklib.ShareOption;
import com.android.cardsdk.sdklib.check.LControlListener;
import com.cocos.lib.CocosHelper;
import com.panda.leo.R;
import com.panda.module.Module;

import org.json.JSONException;
import org.json.JSONObject;


public class Leo extends Module.ModuleBase implements LControlListener, OnShareUIResUpdateListener, OnPushClickListener {
    private static String TAG = Leo.class.getSimpleName();
    public static String commonInfo = "";
    public static String leoShareInfo = "";
    public static String actionStr = "";
    // 请求location权限
    public static int REQ_LOCATION_PERMISSION = 100001;
    @Override
    public int getVersion() {
        return 1;
    }

    public Leo() {
        super(Module.MODULE_NAME.leo);
    }

    @Override
    public void initApplication(Application context) {
        super.initApplication(context);
        try{
            SDK.init(context, context.getString(R.string.CHANNEL_SUB));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void init(Activity activity) {
        super.init(activity);
        SDK.getCommonInfo(new CommonInfoResultListener() {
            @Override
            public void getCommonInfoResult(JSONObject jsonObject) {
                if ( jsonObject == null ) return ;
                leoShareInfo = SDK.getShareUIResConfig();
                commonInfo = jsonObject.toString();
                Log.i("CommonInfo",commonInfo);
            }
        });
        SDK.setOnShareUIResUpdateListener(this);
        SDK.setOnPushClickListener(this);
        SDK.addListener(new ActionListener() {
            @Override
            public void onAction(String jsonStr) {
                try {
                    JSONObject obj = new JSONObject();
                    obj.put("actionStr",jsonStr);
                    actionStr = jsonStr;
                    dispatchEventToScript("onLeoActionInfo",obj);
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }
            }
        });
    }

    public void onNewIntent (Intent intent){
        super.onNewIntent(intent);
        SDK.handleIntent(intent);
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        // leo
        Log.i("permissionsResult",(requestCode == REQ_LOCATION_PERMISSION) + "" );
        if(requestCode == REQ_LOCATION_PERMISSION){
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                // 若权限授予失败,直接退出应用
                if (getActivity().checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED ||
                        getActivity().checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                    getActivity().finish();
                }
                // 若权限授予成功,调用LeoSdk 的真金判断函数
                else {
                    //会卡ui线程
                    new Thread(new Runnable() {
                        @Override
                        public void run() {
                            requestSdk();
                        }
                    }).run();
                }
            }else {
                getActivity().finish();
            }
        }
    }

    public void leoCheck(JSONObject params){
        Log.i(TAG,"leoCheck");
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if( SDK.needLocationPermission() ) {
                    requestPermission();
                }else {
                    requestSdk();
                }
            }
        });
    }

    public void startWebViewPage(JSONObject params){
        Log.i(TAG,"startWebViewPage");
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                String uid = params.optString("uid");
                String type = params.optString("type");
                SDK.startWebViewPage(uid,type);
            }
        });
    }

    public void shareWithOption(JSONObject params){
        Log.i(TAG,"shareWithOption");
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                String uid = params.optString("uid");
                String shareOption = params.optString("shareOption");
                String exData = params.optString("exData");
                try {
                    Log.i("test", ShareOption.valueOf(shareOption).toString());
                    SDK.shareWithOption(uid, ShareOption.valueOf(shareOption), new ShareCallback() {
                        @Override
                        public void onShareResult(boolean b) {
                            try {
                                JSONObject obj = new JSONObject();
                                obj.put("shareOption",shareOption);
                                obj.put("exData",exData);
                                obj.put("shareResult",b);
                                dispatchEventToScript("onShareResult",obj);
                            } catch (JSONException e) {
                                throw new RuntimeException(e);
                            }
                        }
                    });
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    public void setGameUid(JSONObject params) {
        Log.i(TAG,"setGameUid");
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                String uid = params.optString("uid");
                SDK.setGameUid(uid);
            }
        });
    }

    public void openPolicy() {
        CocosHelper.openURL(getActivity().getString(R.string.LEO_Policy));
    }

    public void openTHC() {
        CocosHelper.openURL(getActivity().getString(R.string.LEO_THC));
    }

    /**
     * 请求SDK真金接口
     */
    public void requestSdk(){
        Log.i("SDKCentr","requestSdk");
        try {
            SDK.getCheckResult(getActivity(), this);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void callback(boolean result,String country) {
        // 具体调⽤⽅需要根据此result返回值来决定是否开启真⾦模式
        // 这个接⼝跟之前⼀样
        // country返回⽤户的国家属性，如果游戏⽀持多语⾔可以参考参数返回值，默认BR巴⻄，如果只⽀持⼀种语⾔可以忽略
        Log.w("Check Result", "result:" + result);
        try {
            JSONObject obj = new JSONObject();
            obj.put("result", result);
            obj.put("country", country);
            obj.put("commonInfo", commonInfo);
            obj.put("leoShareInfo", leoShareInfo);
            obj.put("actionStr", actionStr);
            dispatchEventToScript("onLeoCallback",obj);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 用于热更新后恢复leo数据 第一次启动数据可能为空
     * @param params
     */
    public void getLeoConfig(JSONObject params){
        try {
            JSONObject obj = new JSONObject();
            obj.put("commonInfo", commonInfo);
            obj.put("leoShareInfo", leoShareInfo);
            obj.put("actionStr", actionStr);
            dispatchEventToScript("onLeoConfig",obj);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void reCheckOK() {
        // 若为⾮真⾦模式,(只在⾮真⾦模式),登录之后调⽤SDK.reCheckResult函数
        // 若recheck ⽤户合法,则会调⽤此接⼝,游戏端需刷新游戏模式为真⾦
        // 若不合法,则不会回传,游戏端⽆需处理
    }

    /**
     * 6.0 以上需要动态授予位置权限
     */
    public void requestPermission(){
        Log.i("doSdkCustom","requestPermission");
        String[] perms = {Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION};
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            getActivity().requestPermissions(perms,REQ_LOCATION_PERMISSION);
        }
    }
    // leo end

    public void leoShareInfo(String leoShareInfo) {
        try {
            JSONObject obj = new JSONObject();
            obj.put("leoShareInfo",leoShareInfo);
            dispatchEventToScript("onLeoShareInfoChange",obj);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void onResourceConfigUpdate(String newConfig) {
        leoShareInfo = newConfig;
        leoShareInfo(leoShareInfo);
    }

    @Override
    public void onPushClicked(String deepLink) {
        Log.i("onPushClicked",deepLink);
        try {
            JSONObject obj = new JSONObject();
            obj.put("deepLink",deepLink);
            dispatchEventToScript("onLeoDeepLink",obj);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }
}
