package com.panda.module;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.panda.util.AdvertisingIdClient;
import com.panda.util.EasyPhotos;
import com.panda.util.PDLog;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;

import pub.devrel.easypermissions.EasyPermissions;


public class Device extends Module.ModuleBase implements EasyPermissions.PermissionCallbacks{
    private static final String TAG = Device.class.getSimpleName();
    private static Device mInstance;
    public static String mGAId = "";
    public static boolean mOptOutEnabled;

    public static Device shared() { return Device.mInstance; }

    Device() {
        super(Module.MODULE_NAME.device);
        mInstance = this;
    }

    @Override
    public int getVersion() {
        return 1;
    }

    @Override
    public void init(Activity activity) {
        super.init(activity);
        EasyPhotos.init(activity);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        EasyPhotos.onActivityResult(requestCode,resultCode,data);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        // Forward results to EasyPermissions
        EasyPermissions.onRequestPermissionsResult(requestCode, permissions, grantResults, this);
    }

    @Override
    public void onPermissionsGranted(int requestCode, List<String> perms) {
        try {
            JSONObject data = new JSONObject();
            JSONArray jperms= new JSONArray(perms);
            data.put("perms",jperms);
            data.put("requestCode",requestCode);
            dispatchEventToScript("onPermissionsGranted",data);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onPermissionsDenied(int requestCode, List<String> perms) {
        try {
            JSONObject data = new JSONObject();
            JSONArray jperms= new JSONArray(perms);
            data.put("perms",jperms);
            data.put("requestCode",requestCode);
            dispatchEventToScript("onPermissionsDenied",data);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void showSplashView(JSONObject params) {
        getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                ModuleManager.shared().getActivity().showSplashView();
            }
        });
    }
    public void hideSplashView(JSONObject params) {
        getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                ModuleManager.shared().getActivity().hideSplashView();
            }
        });
    }
}
