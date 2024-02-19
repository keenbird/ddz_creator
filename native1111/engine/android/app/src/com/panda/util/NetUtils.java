package com.panda.util;

import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.telephony.CellInfo;
import android.telephony.CellInfoCdma;
import android.telephony.CellInfoGsm;
import android.telephony.CellInfoLte;
import android.telephony.CellInfoWcdma;
import android.telephony.CellSignalStrength;
import android.telephony.CellSignalStrengthCdma;
import android.telephony.CellSignalStrengthGsm;
import android.telephony.CellSignalStrengthLte;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;
import android.util.Log;

import androidx.annotation.RequiresPermission;

import com.panda.module.Module;
import com.panda.module.ModuleManager;

import java.util.Timer;
import java.util.TimerTask;

public class NetUtils {
    private static WifiManager wifiManager;
    public static final int NETWORK_TYPE_NONE = 0;
    public static final int NETWORK_TYPE_LAN = 1;
    public static final int NETWORK_TYPE_WWAN = 2;

    //获取wifi信号强度
    public static int getWifiLevel() {
        if (wifiManager == null) {
            wifiManager = (WifiManager) ModuleManager.shared().getActivity().getApplicationContext().getSystemService(Activity.WIFI_SERVICE);
        }
        WifiInfo wifiInfo = wifiManager.getConnectionInfo();
        int numberOfLevels = 5;
        int level = WifiManager.calculateSignalLevel(wifiInfo.getRssi(), numberOfLevels);
        return level;
    }

    @TargetApi(Build.VERSION_CODES.JELLY_BEAN_MR2)
    @RequiresPermission(value = "android.permission.ACCESS_FINE_LOCATION")
    public static int getTeleSignalStrength() {
        final Activity activity = ModuleManager.shared().getActivity();
        final Context context = activity.getApplicationContext();

        int level = 0;

        final TelephonyManager tm = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
        for (final CellInfo info : tm.getAllCellInfo()) {
            if (info instanceof CellInfoGsm) {
                final CellSignalStrengthGsm gsm = ((CellInfoGsm) info).getCellSignalStrength();
                level = gsm.getLevel();
            } else if (info instanceof CellInfoCdma) {
                final CellSignalStrengthCdma cdma = ((CellInfoCdma) info).getCellSignalStrength();
                level = cdma.getLevel();
            } else if (info instanceof CellInfoLte) {
                final CellSignalStrengthLte lte = ((CellInfoLte) info).getCellSignalStrength();
                level = lte.getLevel();
            } else if (info instanceof CellInfoWcdma) {
                final CellSignalStrength wcdma = ((CellInfoWcdma) info).getCellSignalStrength();
                level = wcdma.getLevel();
            }
        }
        return level;
    }

    public static int getNetworkType() {
        int status = NETWORK_TYPE_NONE;
        NetworkInfo networkInfo;
        try {
            ConnectivityManager connMgr = (ConnectivityManager) ModuleManager.shared().getActivity().getSystemService(Context.CONNECTIVITY_SERVICE);
            networkInfo = connMgr.getActiveNetworkInfo();
        } catch (Exception e) {
            e.printStackTrace();
            return status;
        }
        if (networkInfo == null) {
            return status;
        }
        int nType = networkInfo.getType();
        if (nType == ConnectivityManager.TYPE_MOBILE) {
            status = NETWORK_TYPE_WWAN;
        } else if (nType == ConnectivityManager.TYPE_WIFI) {
            status = NETWORK_TYPE_LAN;
        }
        return status;
    }
}
