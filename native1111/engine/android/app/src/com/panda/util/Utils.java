package com.panda.util;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkInfo;
import android.net.Uri;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Looper;
import android.provider.Settings;
import android.telephony.TelephonyManager;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.RequiresPermission;
import androidx.core.content.FileProvider;

import com.cocos.lib.CocosHelper;
import com.google.gson.JsonObject;
import com.panda.module.Device;
import com.panda.module.ModuleManager;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;

import pub.devrel.easypermissions.AppSettingsDialog;
import pub.devrel.easypermissions.EasyPermissions;

public class Utils {
    private static String TAG = Utils.class.getSimpleName();
    private static LocationListener locationListener = null;

    public static void installApk(String path) {
        Activity mainActiviy = ModuleManager.shared().getActivity();
        Context context = mainActiviy.getApplicationContext();
        File apk = new File(path);
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            //注意第二个参数，要保持和manifest中android:authorities的值相同
            Uri uri = FileProvider.getUriForFile(context,
                    context.getPackageName() + ".provider", apk);
            intent.setDataAndType(uri, "application/vnd.android.package-archive");
        } else {
            intent.setDataAndType(Uri.fromFile(apk), "application/vnd.android.package-archive");
        }
        try {
            context.startActivity(intent);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public static void setRequestedOrientation(final int screen_orientation) {
        Log.e(TAG, "setRequestedOrientation :" + screen_orientation);
        Activity mainActiviy = ModuleManager.shared().getActivity();
        mainActiviy.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Log.e(TAG, "setRequestedOrientation exe:" + screen_orientation);
                try {
                    if (mainActiviy.getRequestedOrientation() != screen_orientation)
                        mainActiviy.setRequestedOrientation(screen_orientation);
                } catch (Throwable e) {
                    e.printStackTrace();
                }
            }
        });
    }
    public static int getRequestedOrientation() {
        Activity mainActiviy = ModuleManager.shared().getActivity();
        int screen_orientation = mainActiviy.getRequestedOrientation();
        Log.e(TAG, "getRequestedOrientation :" + screen_orientation);
        return screen_orientation;
    }

    /**
     * 跳转app设置界面
     */
    public static void gotoAppDetailIntent() {
        ModuleManager.shared().getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                Uri uri = Uri.fromParts("package", ModuleManager.shared().getActivity().getPackageName(), null);
                intent.setData(uri);
                try {
                    ModuleManager.shared().getActivity().startActivity(intent);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    /**
     * 跳转权限设置界面提示弹窗
     *
     * @param title     弹窗标题
     * @param rationale 弹窗内容
     */
    public static void gotoSettings(String title, String rationale) {
        ModuleManager.shared().getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                new AppSettingsDialog.Builder(ModuleManager.shared().getActivity()).setTitle(title)
                        .setRationale(rationale).build().show();
            }
        });
    }


    // OperatorsID
    public static String GetOperatorsID() {
        try {
            return ModuleManager.shared().getActivity().getString(com.cocos.service.R.string.OPERATORSID);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "0";
    }

    public static String GetOperatorsSubID() {
        try {
            return ModuleManager.shared().getActivity().getString(com.cocos.service.R.string.CHANNEL_SUB);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    // channel
    public static String GetChannel() {
        try {
            return ModuleManager.shared().getActivity().getString(com.cocos.service.R.string.CHANNEL);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }


    // AndroidId
    public static String getAndroidId() {
        String ANDROID_ID = Settings.Secure.getString(ModuleManager.shared().getActivity().getContentResolver(),
                Settings.Secure.ANDROID_ID);
        Log.i("NekoTest", "ANDROID_ID is " + ANDROID_ID);
        return ANDROID_ID;
    }

    // Serial Number
    public static String getSerialNumber() {
        String SerialNumber = android.os.Build.SERIAL;
        Log.i("NekoTest", "SerialNumber is " + SerialNumber);
        return SerialNumber;
    }

    // cpu号
    public static String getCpuId() {
        String macSerial = null;
        String str = "";
        try {
            Process pp = Runtime.getRuntime().exec("cat /proc/cpuinfo");
            InputStreamReader ir = new InputStreamReader(pp.getInputStream());
            LineNumberReader input = new LineNumberReader(ir);

            for (; null != str; ) {
                str = input.readLine();
                if (str != null) {
                    macSerial = str.trim();// 去空格
                    break;
                }
            }
        } catch (IOException ex) {
            // 赋予默认值
            ex.printStackTrace();
        }
        return macSerial;
    }

    // 获取Mac地址
    public static String getMac() {
        String macSerial = null;
        String str = "";
        try {
            Process pp = Runtime.getRuntime().exec(
                    "cat /sys/class/net/wlan0/address");
            InputStreamReader ir = new InputStreamReader(pp.getInputStream());
            LineNumberReader input = new LineNumberReader(ir);

            for (; null != str; ) {
                str = input.readLine();
                if (str != null) {
                    macSerial = str.trim();// 去空格
                    break;
                }
            }
        } catch (IOException ex) {
            // 赋予默认值
            ex.printStackTrace();
        }
        return macSerial;
    }

    // Android 获取本机Mac地址,需要开启wifi
    @RequiresPermission(allOf = {"android.permission.LOCAL_MAC_ADDRESS", "android.permission.ACCESS_FINE_LOCATION"})
    public static String getLocalMacAddress() {
        if(!EasyPermissions.hasPermissions(ModuleManager.shared().getActivity(), "android.permission.LOCAL_MAC_ADDRESS", "android.permission.ACCESS_FINE_LOCATION")){
            return "02:00:00:00:00:00";
        }
        WifiManager wifi = (WifiManager) ModuleManager.shared().getActivity().getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        WifiInfo info = wifi.getConnectionInfo();
        return info.getMacAddress();
    }

    // Android 获取本机IP地址方法
    public static String getLocalIpAddress() {
        try {
            for (Enumeration<NetworkInterface> en = NetworkInterface
                    .getNetworkInterfaces(); en.hasMoreElements(); ) {
                NetworkInterface intf = en.nextElement();
                for (Enumeration<InetAddress> enumIpAddr = intf
                        .getInetAddresses(); enumIpAddr.hasMoreElements(); ) {
                    InetAddress inetAddress = enumIpAddr.nextElement();
                    if (!inetAddress.isLoopbackAddress()) {
                        return inetAddress.getHostAddress().toString();
                    }
                }
            }
        } catch (SocketException ex) {
            Log.e("IpAddress", ex.toString());
        }
        return null;
    }

    // 获取系统版本号
    public static String getSysVersion() {
        String ANDROID_TAG = getSysProperty("ro.build.display.id");
        return android.os.Build.VERSION.RELEASE + " " + ANDROID_TAG;
    }

    // 获取手机型号
    public static String getMobileModel() {
        return android.os.Build.MODEL;
    }

    // 获取随机ID
    public static String getUUID() {
        String uuid = Installation.id(ModuleManager.shared().getActivity());
        Log.d("NekoTest ", "Installation.id(this) is " + uuid);
        return uuid;
    }

    // 获取cpu名字
    public static String getCpuName() {
        try {
            FileReader fr = new FileReader("/proc/cpuinfo");
            BufferedReader br = new BufferedReader(fr);
            String text = br.readLine();
            String[] array = text.split(":\\s+", 2);
            for (int i = 0; i < array.length; i++) {
            }
            return array[1];
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    // 获取cpu型号
    public static String getCpuModel() {
        try {
            FileReader fr = new FileReader("/proc/cpuinfo");
            BufferedReader br = new BufferedReader(fr);
            String text = null;

            while ((text = br.readLine()) != null) {
                String[] array = text.split(":\\s+", 2);
                for (int i = 0; i < array.length; i++) {
                }
                if (array[0].contains("Hardware")) {
                    Log.i("NekoTest", "The Cup is " + array[1]);
                    return array[1];
                }
            }

            return null;
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 获取CPU序列号
     *
     * @return CPU序列号(16位) 读取失败为"0000000000000000"
     */
    public static String getCPUSerial() {
        String str = "", strCPU = "", cpuAddress = "0000000000000000";
        try {
            // 读取CPU信息
            Process pp = Runtime.getRuntime().exec("cat /proc/cpuinfo");
            InputStreamReader ir = new InputStreamReader(pp.getInputStream());
            LineNumberReader input = new LineNumberReader(ir);
            // 查找CPU序列号
            for (int i = 1; i < 100; i++) {
                str = input.readLine();
                if (str != null) {
                    // 查找到序列号所在行
                    if (str.indexOf("Serial") > -1) {
                        // 提取序列号
                        strCPU = str.substring(str.indexOf(":") + 1,
                                str.length());
                        // 去空格
                        cpuAddress = strCPU.trim();
                        break;
                    }
                } else {
                    // 文件结尾
                    break;
                }
            }
        } catch (IOException ex) {
            // 赋予默认值
            ex.printStackTrace();
        }
        // Log.i("NekoTest", "The Cup Serial is " + cpuAddress);
        return cpuAddress;
    }

    // 获取系统属性值----系统反射
    public static String getSysProperty(String key) {
        Class<?> clazz;
        try {
            clazz = Class.forName("android.os.SystemProperties");
            Method method = clazz.getDeclaredMethod("get", String.class);
            return (String) method.invoke(clazz.newInstance(), key);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (InstantiationException e) {
            e.printStackTrace();
        }
        return "";
    }

    //设置剪切板内容
    public static void setClipBoard(final String strName) {
        ModuleManager.shared().getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                ClipboardManager clipboardManager = (ClipboardManager) ModuleManager.shared().getActivity().getSystemService(Context.CLIPBOARD_SERVICE);
                ClipData cd = ClipData.newPlainText("label", strName);
                clipboardManager.setPrimaryClip(cd);
                Toast.makeText(ModuleManager.shared().getActivity(), "Successfully copied", Toast.LENGTH_SHORT).show();
            }
        });

    }

    //获取剪切板内容
    public static String getClipBoard() {
        try {
            if (Looper.myLooper() == null) {
                Looper.prepare();
            }
            String ret = "";
            ClipboardManager clipboardManager = (ClipboardManager) ModuleManager.shared().getActivity()
                    .getSystemService(Context.CLIPBOARD_SERVICE);
            if (clipboardManager == null) {
                Log.i("cp", "getClipBoard clipboardManager==null");
            }
            ClipData cd2 = clipboardManager.getPrimaryClip();
            if (cd2.getItemAt(0) != null) {
                Log.i("cp", "getClipBoard getItemAt:0");
                ret = cd2.getItemAt(0).getText().toString();
            }
            Log.i("cp", "getClipBoard:" + ret);
            return ret;
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    /**
     * 跳转设置位置权限
     */
    public static void gotoLocationSetting() {
        ModuleManager.shared().getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Intent i = new Intent();
                i.setAction(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                try {
                    ModuleManager.shared().getActivity().startActivity(i);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    /**
     * 获取手机唯一标识
     *
     * @return
     */
    @RequiresPermission(value = "android.permission.READ_PRIVILEGED_PHONE_STATE")
    public static String getDeviceId() {
        // 需要android.permission.READ_PHONE_STATE权限
        if(!EasyPermissions.hasPermissions(ModuleManager.shared().getActivity(), "android.permission.READ_PRIVILEGED_PHONE_STATE")){
            return "";
        }
        TelephonyManager tm = (TelephonyManager) ModuleManager.shared().getActivity().getSystemService(Context.TELEPHONY_SERVICE);
        String DEVICE_ID = tm.getDeviceId();
        Log.i("getDeviceId", DEVICE_ID);
        return DEVICE_ID;
    }

    /**
     * 获取谷歌广告id
     *
     * @return
     */
    public static String getGAID() {
        return Device.mGAId;
    }

    @RequiresPermission(anyOf = {"android.permission.ACCESS_COARSE_LOCATION", "android.permission.ACCESS_FINE_LOCATION"})
    public static String getLngAndLat() {
        JsonObject jsonObject = new JsonObject();
        if(!EasyPermissions.hasPermissions(ModuleManager.shared().getActivity(), "android.permission.ACCESS_COARSE_LOCATION", "android.permission.ACCESS_FINE_LOCATION")){
            jsonObject.addProperty("ret", -1);
            jsonObject.addProperty("msg", "No Setting");
            return jsonObject.toString();
        }
        LocationManager locationManager = (LocationManager) ModuleManager.shared().getActivity().getSystemService(Context.LOCATION_SERVICE);
        // 获取最佳服务对象
        String provider = null;
        //2.获取位置提供器，GPS或是NetWork
        List<String> providers = locationManager.getProviders(true);
        if (providers.contains(LocationManager.NETWORK_PROVIDER)) {
            //如果是网络定位
            Log.d("getLngAndLat", "如果是网络定位");
            provider = LocationManager.NETWORK_PROVIDER;
        } else if (providers.contains(LocationManager.GPS_PROVIDER)) {
            //如果是GPS定位
            Log.d("getLngAndLat", "如果是GPS定位");
            provider = LocationManager.GPS_PROVIDER;
        }
        if (provider == null) {
            jsonObject.addProperty("ret", -2);
            jsonObject.addProperty("msg", "No Setting");
            return jsonObject.toString();
        }
        Location location = locationManager.getLastKnownLocation(provider);
        if (location != null) {
            Log.d("getLngAndLat", "定位成功------->" + "location------>纬度为：" + location.getLatitude() + "\n经度为" + location.getLongitude());
            jsonObject.addProperty("ret", 1);
            jsonObject.addProperty("lat", location.getLatitude());
            jsonObject.addProperty("lng", location.getLongitude());
            return jsonObject.toString();
        }

        jsonObject.addProperty("ret", 2);
        jsonObject.addProperty("lat", 0);
        jsonObject.addProperty("lng", 0);
        return jsonObject.toString();
    }

    /**
     * 添加经纬度变化监听
     */
    @RequiresPermission(anyOf = {"android.permission.ACCESS_COARSE_LOCATION", "android.permission.ACCESS_FINE_LOCATION"})
    public static void requestLocationUpdates(int minTimeMs, int minDistanceM) {
        if(!EasyPermissions.hasPermissions(ModuleManager.shared().getActivity(), "android.permission.ACCESS_COARSE_LOCATION", "android.permission.ACCESS_FINE_LOCATION")){
            return ;
        }
        if (locationListener != null) {
            removeLocationUpdates();
        }

        LocationManager locationManager = (LocationManager) ModuleManager.shared().getActivity().getSystemService(Context.LOCATION_SERVICE);
        // 获取最佳服务对象
        String provider = null;
        //2.获取位置提供器，GPS或是NetWork
        List<String> providers = locationManager.getProviders(true);
        if (providers.contains(LocationManager.NETWORK_PROVIDER)) {
            //如果是网络定位
            Log.d("requestLocationUpdates", "如果是网络定位");
            provider = LocationManager.NETWORK_PROVIDER;
        } else if (providers.contains(LocationManager.GPS_PROVIDER)) {
            //如果是GPS定位
            Log.d("requestLocationUpdates", "如果是GPS定位");
            provider = LocationManager.GPS_PROVIDER;
        }
        if (provider == null) {
            return;
        }
        locationListener = new LocationListener() {
            @Override
            public void onLocationChanged(Location location) {
                try {
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("lat", location.getLatitude());
                    jsonObject.put("lng", location.getLongitude());
                    Device.shared().dispatchEventToScript("onLocationChanged", jsonObject);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onStatusChanged(String provider, int status, Bundle extras) {

            }
        };
        final String final_provider = provider;
        // 监视地理位置变化，第二个和第三个参数分别为更新的最短时间minTime和最短距离minDistace
        ModuleManager.shared().getActivity().runOnUiThread(new Runnable() {
            @Override
            @RequiresPermission(anyOf = {"android.permission.ACCESS_COARSE_LOCATION", "android.permission.ACCESS_FINE_LOCATION"})
            public void run() {
                locationManager.requestLocationUpdates(final_provider, minTimeMs, minDistanceM, locationListener);
            }
        });
    }

    /**
     * 移除经纬度变化监听
     */
    public static void removeLocationUpdates() {
        if (locationListener == null) return;
        LocationManager locationManager = (LocationManager) ModuleManager.shared().getActivity().getSystemService(Context.LOCATION_SERVICE);
        locationManager.removeUpdates(locationListener);
    }

    public static String getAppVersion() {
        try {
            PackageManager pm = ModuleManager.shared().getActivity().getPackageManager();
            PackageInfo pi = pm.getPackageInfo(ModuleManager.shared().getActivity().getPackageName(),
                    PackageManager.GET_CONFIGURATIONS);
            return pi.versionName;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return "";
    }

    static public boolean isAppInstall(String packageName) {
        PackageInfo packageInfo = null ;
        try {
            packageInfo = ModuleManager.shared().getActivity().getPackageManager().getPackageInfo(packageName, 0);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return packageInfo==null?false:true;
    }


    /**
     * 是否正在使用VPN
     */
    public static boolean isVpnUsed() {
        try {
            ConnectivityManager connectivityManager = (ConnectivityManager) ModuleManager.shared().getActivity()
                    .getSystemService(Context.CONNECTIVITY_SERVICE);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                Network activeNetwork = connectivityManager.getActiveNetwork();
                NetworkCapabilities caps = connectivityManager.getNetworkCapabilities(activeNetwork);
                return caps.hasTransport(NetworkCapabilities.TRANSPORT_VPN);
            }else {
                NetworkInfo networkInfo = connectivityManager.getNetworkInfo(ConnectivityManager.TYPE_VPN);
                return networkInfo == null ? false : networkInfo.isConnected();
            }
        } catch (Throwable e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * 是否使用代理(WiFi状态下的,避免被抓包)
     */
    public static boolean isWifiProxy(){
        final boolean is_ics_or_later = Build.VERSION.SDK_INT >= Build.VERSION_CODES.ICE_CREAM_SANDWICH;
        String proxyAddress;
        int proxyPort;
        if (is_ics_or_later) {
            proxyAddress = System.getProperty("http.proxyHost");
            String portstr = System.getProperty("http.proxyPort");
            proxyPort = Integer.parseInt((portstr != null ? portstr : "-1"));
            System.out.println(proxyAddress + "~");
            System.out.println("port = " + proxyPort);
        }else {
            proxyAddress = android.net.Proxy.getHost(ModuleManager.shared().getActivity());
            proxyPort = android.net.Proxy.getPort(ModuleManager.shared().getActivity());
            Log.e("address = ", proxyAddress + "~");
            Log.e("port = ", proxyPort + "~");
        }
        return (!TextUtils.isEmpty(proxyAddress)) && (proxyPort != -1);
    }

    static public void shareTextToApp(final String packageName,final String appName,final String msg){
        ModuleManager.shared().getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if ( isAppInstall(packageName) ){
                    Intent sendIntent = new Intent();
                    sendIntent.setAction(Intent.ACTION_SEND);
                    sendIntent.setType("text/plain");
                    sendIntent.putExtra(Intent.EXTRA_TEXT, msg);
                    sendIntent.setPackage(packageName);
                    ModuleManager.shared().getActivity().startActivity(sendIntent);
                }else {
                    Toast.makeText(ModuleManager.shared().getActivity(), "Need to install "+appName, Toast.LENGTH_SHORT)
                            .show();
                }
            }
        });
    }

    public static void postException(String reason, String stack){
        Log.i(TAG,"reason："+reason);
        Log.i(TAG,"stack："+stack);
        ModuleManager.shared().postException(reason,stack);
    }

    public static int getSDKtype() {
        return ModuleManager.shared().getActivity().getResources().getInteger(com.cocos.service.R.integer.sdk_type);
    }
}
