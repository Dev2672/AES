/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Encrypt/decrypt files                                                                         */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

function encryptFile(file) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(file); // readAsArrayBuffer to handle binary files
    reader.onload = function(evt) {
        $('body').css({'cursor':'wait'});

        var contentBytes = new Uint8Array(reader.result);       //Aes.Ctr.encrypt sirf string as an input leta hai,
        var contentStr = '';                                    //but converting binary file directly to string could
        for (var i=0; i<contentBytes.length; i++) {             // give invalid Unicode sequences, so convert 
            contentStr += String.fromCharCode(contentBytes[i]); //bytestream ArrayBuffer to single-byte chars
                                                                    
        }

        var password = $('#password-file').val();

        var t1 = new Date();
        var ciphertext = Aes.Ctr.encrypt(contentStr, password, 256);
        var t2 = new Date();

        // use Blob to save encrypted file
        var blob = new Blob([ciphertext], { type: 'text/plain' });
        var filename = file.name+'.encrypted';
        saveAs(blob, filename);

        $('#encrypt-file-time').html(((t2 - t1)/1000)+'s'); // display time taken
        $('body').css({'cursor':'default'});
    }
}

function decryptFile(file) {
    var reader = new FileReader();
    reader.readAsText(file); // .ReadAsText to read (base64-encoded) ciphertext file
    reader.onload = function(evt) {
        $('body').css({'cursor':'wait'});

        var content = reader.result; 
        var password = $('#password-file').val();

        var t1 = new Date();
        var plaintext = Aes.Ctr.decrypt(content, password, 256);
        var t2 = new Date();

        // convert single-byte character stream to ArrayBuffer bytestream
        var contentBytes = new Uint8Array(plaintext.length);
        for (var i=0; i<plaintext.length; i++) {
            contentBytes[i] = plaintext.charCodeAt(i);
        }

        // use Blob to save decrypted file
        var blob = new Blob([contentBytes], { type: 'application/octet-stream' });
        var filename = file.name.replace(/\.encrypted$/,'')+'.decrypted';
        saveAs(blob, filename);

        $('#decrypt-file-time').html(((t2 - t1)/1000)+'s'); // display time taken
        $('body').css({'cursor':'default'});
    }
}

/* Mujhe bhi nahi samjha ye kya hai, didi ne likhne ko kaha tha Modular ke liye*/
if (typeof module != 'undefined' && module.exports) module.exports = Aes; // CommonJs export
if (typeof define == 'function' && define.amd) define([], function() { return Aes; }); // AMD