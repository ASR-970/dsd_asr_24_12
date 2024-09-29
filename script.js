// Event listener for SOP button to navigate to the registration number page
document.getElementById("button1").addEventListener("click", function() {
    document.getElementById("buttonContainer").style.display = "none"; // Hide button page
    document.getElementById("regNumberPage").style.display = "block"; // Show registration page
});

// Event listener for generating Verilog code and testbench
document.getElementById("generateCode").addEventListener("click", function() {
    const regNumber = document.getElementById("regNumber").value;
    const minterms = [];

    // Determine the minterms based on the registration number
    if (regNumber.includes("B")) minterms.push(11);
    if (regNumber.includes("C")) minterms.push(12);
    if (regNumber.includes("E")) minterms.push(14);

    // Include all minterms from 0 to 15 based on the reg number
    for (let i = 0; i < 16; i++) {
        if (regNumber.includes(i.toString())) {
            minterms.push(i);
        }
    }

    // Remove duplicates from the minterms array
    const uniqueMinterms = [...new Set(minterms)];

    // Generate Verilog code based on the minterms
    let verilogCode = "module logic_function(\n";
    verilogCode += "    input A, B, C, D,\n"; // Example inputs
    verilogCode += "    output F\n";
    verilogCode += ");\n";
    verilogCode += "    assign F = ";

    // Create a logic expression based on the unique minterms
    const terms = uniqueMinterms.map(m => {
        const binary = m.toString(2).padStart(4, '0'); // Convert to binary
        let term = '';

        for (let j = 0; j < binary.length; j++) {
            if (binary[j] === '1') {
                term += String.fromCharCode(65 + j); // A, B, C, D
            } else {
                term += `~${String.fromCharCode(65 + j)}`; // ~A, ~B, ~C, ~D
            }
        }

        return term; // Return the term for the minterm
    }).join(' + ');

    verilogCode += terms + ";\n";
    verilogCode += "endmodule\n\n";

    // Generate Verilog testbench code
    let testbenchCode = "module tb_logic_function;\n";
    testbenchCode += "    reg A, B, C, D;\n";
    testbenchCode += "    wire F;\n\n";
    testbenchCode += "    // Instantiate the logic function\n";
    testbenchCode += "    logic_function uut (\n";
    testbenchCode += "        .A(A), .B(B), .C(C), .D(D), .F(F)\n";
    testbenchCode += "    );\n\n";
    testbenchCode += "    initial begin\n";
    testbenchCode += "        // Test all combinations of inputs\n";
    for (let i = 0; i < 16; i++) {
        const binary = i.toString(2).padStart(4, '0'); // Binary representation of inputs
        testbenchCode += `        A = ${binary[0]}; B = ${binary[1]}; C = ${binary[2]}; D = ${binary[3]};\n`;
        testbenchCode += "        #10;\n"; // 10 time units delay
    }
    testbenchCode += "    end\n";
    testbenchCode += "endmodule\n";

    // Combine Verilog code and testbench
    const completeCode = verilogCode + "\n" + testbenchCode;

    // Display the generated Verilog code and testbench
    document.getElementById("verilogOutput").textContent = completeCode;
});

// Copy to clipboard functionality
document.getElementById("copyCode").addEventListener("click", function() {
    const code = document.getElementById("verilogOutput").textContent;
    navigator.clipboard.writeText(code).then(function() {
        alert("Verilog code copied to clipboard!");
    }, function(err) {
        alert("Failed to copy text: ", err);
    });
});
