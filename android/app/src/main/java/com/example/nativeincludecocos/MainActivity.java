package com.example.nativeincludecocos;


import android.app.Activity;
import android.app.Fragment;
import android.app.FragmentManager;
import android.app.FragmentTransaction;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.PixelFormat;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.FrameLayout;

import androidx.appcompat.app.AppCompatActivity;

import com.example.nativeincludecocos.present.CocosLifecycle;
import com.example.nativeincludecocos.utils.UriUtils;
import com.google.android.exoplayer2.ExoPlayer;
import com.google.android.exoplayer2.MediaItem;
import com.google.android.exoplayer2.SimpleExoPlayer;
import com.google.android.exoplayer2.ui.StyledPlayerControlView;
import com.google.android.exoplayer2.ui.StyledPlayerView;

import org.cocos2dx.javascript.SDKWrapper;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

public class MainActivity extends AppCompatActivity {

    private FrameLayout frameLayout;
    private SimpleExoPlayer simpleExoPlayer;
    private StyledPlayerControlView styledPlayerControlView;
    private StyledPlayerView styledPlayerView;
    private Button button;
    public static CocosLifecycle app = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        System.loadLibrary("cocos2djs");
        app = new CocosLifecycle(this);
        app.onCreate();
        //        getLifecycle().addObserver(app);

        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            // Android launched another instance of the root activity into an existing task
            //  so just quietly finish and go away, dropping the user back into the activity
            //  at the top of the stack (ie: the last state of this task)
            // Don't need to finish it again since it's finished in super.onCreate .
            return;
        }
        // DO OTHER INITIALIZATION BELOW
        setContentView(R.layout.activity_main);
        frameLayout = findViewById(R.id.fragment_container);
        FragmentManager fragmentManager = getFragmentManager();
        FragmentTransaction transaction = fragmentManager.beginTransaction();
        MyFragment fragment = new MyFragment();
        transaction.add(R.id.fragment_container, fragment).commit();
//        frameLayout.addView(app.mFrameLayout);
        simpleExoPlayer = new SimpleExoPlayer.Builder(this).build();
        styledPlayerView = findViewById(R.id.player_view);
        button = findViewById(R.id.button);
        Uri uri = UriUtils.resConvertUri(this, R.raw.liveme);
        MediaItem item = MediaItem.fromUri(uri);
        styledPlayerView.setPlayer(simpleExoPlayer);
        simpleExoPlayer.setRepeatMode(ExoPlayer.REPEAT_MODE_ONE);
        simpleExoPlayer.setMediaItem(item);
        simpleExoPlayer.prepare();
        simpleExoPlayer.play();
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_VISIBLE);

        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // 一定要在 GL 线程中执行
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("globalThis.window.tscall.tscall.change()");
                    }
                });
            }
        });
        SDKWrapper.getInstance().init(this);
    }

    @Override
    protected void onResume() {
        app.paused = false;
        super.onResume();
        app.onResume();
        SDKWrapper.getInstance().onResume();

    }

    @Override
    protected void onPause() {
        app.paused = true;
        super.onPause();
        app.onPause();
        SDKWrapper.getInstance().onPause();

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        app.onDestory();
        SDKWrapper.getInstance().onDestroy();

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        app.onActivityResult(resultCode, resultCode, data);
        SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.getInstance().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.getInstance().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.getInstance().onStop();
    }

    @Override
    public void onBackPressed() {
        SDKWrapper.getInstance().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.getInstance().onStart();
        super.onStart();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        app.onWindowFocusChanged(hasFocus);
    }

    public static void showButton() {
        app.mActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
//                app.button.setVisibility(View.VISIBLE);
            }
        });
    }

    public static void hideButton() {
        app.mActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Log.d("toto", "button");
//                app.button.setVisibility(View.INVISIBLE);
            }
        });
    }
}