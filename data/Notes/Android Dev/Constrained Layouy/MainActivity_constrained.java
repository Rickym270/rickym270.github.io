-package com.example.uibasics;

import android.os.Bundle;
import android.os.SystemClock;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.ProgressBar;
import android.widget.RadioGroup;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity_ProgressBarRadioButtons extends AppCompatActivity {
    // TODO: Init variables up top so that they can be referenced in other class functions
    private CheckBox checkBoxHarry, checkBoxMatrix, checkBoxJoker;
    private RadioGroup rgMaritalStatus;
    private ProgressBar progressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // TODO: Find the views by ID (Specified in XML)
        checkBoxHarry = findViewById(R.id.checkboxHarry);
        checkBoxMatrix = findViewById(R.id.checkboxMatrix);
        checkBoxJoker  = findViewById(R.id.checkboxJoker);

        rgMaritalStatus = findViewById(R.id.rgMaritalStatus);

        progressBar = findViewById(R.id.progressBar);

        // TODO: Create a worker thread
        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < 10; i++){
                    // TODO: Increment progress of progress bar by 10
                    progressBar.incrementProgressBy(10);
                    SystemClock.sleep(500);
                }
            }
        }); 
        // TODO: Start thread
        thread.start();

        // TODO: Make the progressBar dynamic
        //          Return and integer of the current progress
        progressBar.getProgress();

        int checkedButton = rgMaritalStatus.getCheckedRadioButtonId();
        // TODO: Define actions for different radio buttons that are checked
        switch(checkedButton){
            case R.id.rbMarried:
                Toast.makeText(MainActivity_ProgressBarRadioButtons.this, "Married", Toast.LENGTH_SHORT).show();
                break;
            case R.id.rbInRelationship:
                Toast.makeText(MainActivity_ProgressBarRadioButtons.this, "In a Relationship", Toast.LENGTH_SHORT).show();
                break;
            case R.id.rbSingle:
                Toast.makeText(MainActivity_ProgressBarRadioButtons.this, "Single", Toast.LENGTH_SHORT).show();
                break;
            default:
                Toast.makeText(MainActivity_ProgressBarRadioButtons.this, "Choose a marital status", Toast.LENGTH_SHORT).show();
                break;
        }

        // TODO: Listen for any changes
        rgMaritalStatus.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(RadioGroup radioGroup, int checkedId) {
                switch (checkedId){
                    case R.id.rbMarried:
                        Toast.makeText(MainActivity_ProgressBarRadioButtons.this, "Married", Toast.LENGTH_SHORT).show();
                        break;
                    case R.id.rbInRelationship:
                        Toast.makeText(MainActivity_ProgressBarRadioButtons.this, "In a Relationship", Toast.LENGTH_SHORT).show();
                        break;
                    case R.id.rbSingle:
                        Toast.makeText(MainActivity_ProgressBarRadioButtons.this, "Single", Toast.LENGTH_SHORT).show();
                        break;
                    default:
                        Toast.makeText(MainActivity_ProgressBarRadioButtons.this, "Choose a marital status", Toast.LENGTH_SHORT).show();
                        break;
                }
            }
        });

        if(checkBoxHarry.isChecked()){
            Toast.makeText(MainActivity_ProgressBarRadioButtons.this, "You have watched HP", Toast.LENGTH_SHORT).show();
        }else{
            Toast.makeText(MainActivity_ProgressBarRadioButtons.this, "You NEED to watch Harry", Toast.LENGTH_SHORT).show();
        }
        checkBoxHarry.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean isChecked) {
                if (isChecked){
                    Toast.makeText(MainActivity_ProgressBarRadioButtons.this, "You have watched Harry", Toast.LENGTH_SHORT).show();
                }else{
                    Toast.makeText(MainActivity_ProgressBarRadioButtons.this, "You NEED to watch Harry", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }
}



    //    private TextView txtHello;
//    private EditText edtTxtName;
//
//    @Override
//    public void onClick(View v){
//        switch (v.getId()){
//            case R.id.btnHello:
//                txtHello.setText("Hello " + edtTxtName.getText().toString());
//                break;
//            case R.id.editTxtName:
//                Toast.makeText(this, "Attempting to type something", Toast.LENGTH_SHORT).show();
//            default:
//                break;
//        }
//    }
//
//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        setContentView(R.layout.activity_main);
//
//        Button btnHello = findViewById(R.id.btnHello);
//        btnHello.setOnClickListener(this);
//
//        edtTxtName = findViewById(R.id.editTxtName);
//        edtTxtName.setOnClickListener(this);
//
//        txtHello = findViewById(R.id.txtHello);
//    }
//}
