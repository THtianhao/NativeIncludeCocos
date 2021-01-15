package com.example.nativeincludecocos.utils;

import android.content.ContentResolver;
import android.content.Context;
import android.content.res.Resources;
import android.net.Uri;
import android.util.Log;

public class UriUtils {


    public static  Uri resConvertUri(Context context, int resId) {
        Resources r  = context.getResources();
        Uri uri= Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://"
                + r.getResourcePackageName(resId) + "/"
                + r.getResourceTypeName(resId) + "/"
                + r.getResourceEntryName(resId));
        return uri;
    }
}
