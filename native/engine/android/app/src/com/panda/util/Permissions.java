package com.panda.util;

import com.panda.module.ModuleManager;

import org.json.JSONArray;

import java.util.Arrays;

import pub.devrel.easypermissions.EasyPermissions;

public class Permissions {

    private static final String TAG = Permissions.class.getSimpleName();

    public static boolean somePermissionPermanentlyDenied(String jsonString) {
        try {
            JSONArray jsonArray = new JSONArray(jsonString);
            String[] list = new String[jsonArray.length()];
            for(int i = 0;i < jsonArray.length();i++) {
                list[i] = jsonArray.getString(i);
            }
            return EasyPermissions.somePermissionPermanentlyDenied(ModuleManager.shared().getActivity(), Arrays.asList(list));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public static boolean hasPermissions(String jsonString) {
        try {
            JSONArray jsonArray = new JSONArray(jsonString);
            String[] list = new String[jsonArray.length()];
            for(int i = 0;i < jsonArray.length();i++) {
                list[i] = jsonArray.getString(i);
            }
            return EasyPermissions.hasPermissions(ModuleManager.shared().getActivity(), list);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public static void requestPermissions(final String rationale,final int requestCode,final String jsonString) {
        PDLog.i(TAG,rationale);
        PDLog.i(TAG,"" + requestCode);
        PDLog.i(TAG,jsonString);
        ModuleManager.shared().getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONArray jsonArray = new JSONArray(jsonString);
                    String[] list = new String[jsonArray.length()];
                    for(int i = 0;i < jsonArray.length();i++) {
                        list[i] = jsonArray.getString(i);
                    }
                    EasyPermissions.requestPermissions(ModuleManager.shared().getActivity(), rationale,requestCode,list);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }
}
