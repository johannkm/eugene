//
//  ViewController.swift
//  Eugene
//
//  Created by Jeffrey Li on 5/25/17.
//  Copyright © 2017 Jeffrey Li. All rights reserved.
//

import UIKit
import Foundation
import UICountingLabel
import Speech
import AI
import CoreData
import Foundation
import AVFoundation

class ViewController: UIViewController, SFSpeechRecognizerDelegate {
    
    var timer = Timer()
    func runTimer() {
        timer = Timer.scheduledTimer(timeInterval: 1, target: self, selector: #selector(ViewController.run), userInfo: nil, repeats: true)
    }
    
    @IBOutlet weak var balance: UICountingLabel!
    @IBOutlet weak var microphoneButton: UIButton!
    
    @IBOutlet weak var textView: UITextView!
    private let speechRecognizer = SFSpeechRecognizer(locale: Locale.init(identifier: "en-US"))!
    
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?
    private let audioEngine = AVAudioEngine()
    
    var finalText = ""
    var currAmount = 0
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        run(timer: timer)
        runTimer()
        balance.transform = CGAffineTransform(rotationAngle: CGFloat.pi / 2)
        microphoneButton.transform = CGAffineTransform(rotationAngle: CGFloat.pi / 2)
        textView.autocorrectionType = .no
        textView.spellCheckingType = .no
        
        microphoneButton.isEnabled = false
        
        speechRecognizer.delegate = self
        
        SFSpeechRecognizer.requestAuthorization { (authStatus) in
            
            var isButtonEnabled = false
            
            switch authStatus {
            case .authorized:
                isButtonEnabled = true
                
            case .denied:
                isButtonEnabled = false
                print("User denied access to speech recognition")
                
            case .restricted:
                isButtonEnabled = false
                print("Speech recognition restricted on this device")
                
            case .notDetermined:
                isButtonEnabled = false
                print("Speech recognition not yet authorized")
            }
            
            OperationQueue.main.addOperation() {
                self.microphoneButton.isEnabled = isButtonEnabled
            }
        }
    }
    
    @IBAction func microphoneTapped(_ sender: Any) {
        if audioEngine.isRunning {
            audioEngine.stop()
            recognitionRequest?.endAudio()
            microphoneButton.isEnabled = false
            microphoneButton.setTitle("Start Recording", for: .normal)
        } else {
            startRecording()
            microphoneButton.setTitle("Stop Recording", for: .normal)
        }
    }
    
    override var prefersStatusBarHidden: Bool {
        return true
    }
    
    func test(x: String) {
        let utterance = AVSpeechUtterance(string: x)
        utterance.voice = AVSpeechSynthesisVoice(language: "en-US")
        
        let synth = AVSpeechSynthesizer()
        synth.speak(utterance)
    }
    
    func callAI() {
        let query = finalText
        let request = AI.sharedService.textRequest(query)
        request.success { [weak self] (response) in
            DispatchQueue.main.async {
                print(response.result.fulfillment!.speech)
                let pass = String(response.result.fulfillment!.speech)
                if (pass != "") {
                    self?.test(x: pass!)
                }
            }
            }.failure { (error) in
                DispatchQueue.main.async {
                    print("error")
                }
            }.resume { [weak self] (_) in
                if let sself = self {
                    print("resume")
                }
        }
    }
    
    func startRecording() {

        if recognitionTask != nil {  //1
            recognitionTask?.cancel()
            recognitionTask = nil
        }
        
        let audioSession = AVAudioSession.sharedInstance()  //2
        do {
            try audioSession.setCategory(AVAudioSessionCategoryPlayAndRecord, with: AVAudioSessionCategoryOptions.defaultToSpeaker)
            try audioSession.setMode(AVAudioSessionModeMeasurement)
            try audioSession.setActive(true, with: .notifyOthersOnDeactivation)
        } catch {
            print("audioSession properties weren't set because of an error.")
        }
        
        recognitionRequest = SFSpeechAudioBufferRecognitionRequest()  //3
        
        guard let inputNode = audioEngine.inputNode else {
            fatalError("Audio engine has no input node")
        }  //4
        
        guard let recognitionRequest = recognitionRequest else {
            fatalError("Unable to create an SFSpeechAudioBufferRecognitionRequest object")
        } //5
        
        recognitionRequest.shouldReportPartialResults = true  //6
        
        recognitionTask = speechRecognizer.recognitionTask(with: recognitionRequest, resultHandler: { (result, error) in  //7
            
            var isFinal = false  //8
            
            if result != nil {
                
                self.textView.text = result?.bestTranscription.formattedString  //9
                isFinal = (result?.isFinal)!
            }
            
            if error != nil || isFinal {  //10
                self.audioEngine.stop()
                inputNode.removeTap(onBus: 0)
                
                self.recognitionRequest = nil
                self.recognitionTask = nil
                
                self.microphoneButton.isEnabled = true
                
                self.finalText = self.textView.text
                print(self.finalText)
                self.callAI()
            }
        })
        
        
        let recordingFormat = inputNode.outputFormat(forBus: 0)  //11
        inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { (buffer, when) in
            self.recognitionRequest?.append(buffer)
        }
        
        audioEngine.prepare()  //12
        
        do {
            try audioEngine.start()
        } catch {
            print("audioEngine couldn't start because of an error.")
        }
        
        textView.text = "Say something, I'm listening!"
        
    }
    
    func speechRecognizer(_ speechRecognizer: SFSpeechRecognizer, availabilityDidChange available: Bool) {
        if available {
            microphoneButton.isEnabled = true
        } else {
            microphoneButton.isEnabled = false
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }


    func run(timer: Timer) {
        let url = URL(string: "http://29488423.ngrok.io/payments")
        
        let task = URLSession.shared.dataTask(with: url!) { data, response, error in
            guard error == nil else {
                print(error!)
                return
            }
            guard let data = data else {
                print("Data is empty")
                return
            }
            
            let json = try! JSONSerialization.jsonObject(with: data, options: [])
            let dictionary = json as! [Any]
            
            var sum = 0
            if (dictionary.count == 0) {
                
            }
            if (dictionary.count == 1) {
                let num = dictionary[0] as! [String: Any]
                let x = num["value"]!
                let strings = String(describing: x)
                let number = Int(strings)!
                sum += number
            }
            if (dictionary.count > 1){
                for index in 0...dictionary.count - 1 {
                    let num = dictionary[index] as! [String: Any]
                    let x = num["value"]!
                    let strings = String(describing: x)
                    let number = Int(strings)!
                    sum += number
                }
            }
            
            self.balance.format = "$%d"
            if (self.currAmount != sum) {
                self.balance.count(from: CGFloat(self.currAmount), to: CGFloat(sum), withDuration: 3)
            }
            self.currAmount = sum
            
        }
        task.resume()
    }
}

