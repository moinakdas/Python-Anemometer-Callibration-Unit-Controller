%add subdirectories & load libraries
clear all; %#ok<CLALL>
clc;

addpath("lib");
addpath("core");
addpath("wrappers");
loadphidget21;

% Pull data from JSON file
yawID = 753483;
pitchID = 753486;
gateID = 753327;
interfaceID = 705654;

% Set hashmaps for steps
gateStepMap = containers.Map('KeyType', 'char', 'ValueType', 'int32');
gateStepMap('zero') = -1;
gateStepMap('center') = -1;
gateStepMap('inlet') = -1;
gateStepMap('max') = -1;

yawStepMap('zero') = -1;
yawStepMap('center') = -1;
yawStepMap('max') = -1;

pitchStepMap('zero') = -1;
pitchStepMap('center') = -1;
pitchStepMap('max') = -1;
% Variable initialization


% Initialize all phidget handles and connection status variables
[interfaceHandle,yawHandle,pitchHandle,gateHandle,interfaceConn,yawConn,pitchConn,gateConn] = init_wrapper(interfaceID,yawID,pitchID,gateID);

if yawConn && pitchConn && gateConn && interfaceConn
    fprintf("\n[INIT SUCCESS] All components initialized successfully, proceeding to zero motors\n\n")
    drawnow;
else
    fprintf("[INIT FAIL]")
    drawnow;
end

try
    %Zero motors
    % moveRelative(pitchHandle, -20000);
    pitchZeroStep = zeroMotor(interfaceHandle, pitchHandle, 2000, -500,1);
    fprintf("Pitch motor zeroed at %d\n", pitchZeroStep);
    drawnow;
    moveto(pitchHandle, pitchZeroStep - 34000);
    yawZeroStep = zeroMotor(interfaceHandle, yawHandle,2000,-1000,0);
    fprintf("Yaw motor zeroed at %d\n", yawZeroStep);
    drawnow;
    moveto(yawHandle, yawZeroStep - 48000);
    gateZeroStep = zeroMotor(interfaceHandle, gateHandle,500,-250,2);
    fprintf("Gate motor zeroed at %d\n", gateZeroStep);
    drawnow;
    moveto(gateHandle, gateZeroStep - 12000);
    fprintf("\n[LOCALIZATION SUCCESS]\n")
    drawnow;
    % Replace input()
    while true
        if exist('start_flag.txt', 'file')
            fprintf("Input received!\n");
            break;
        end
        pause(0.5);
    end
    % Execute movements from list + data collection/output
    %pitch yaw gate
    config_set = [30000 48000 12000; 45000 68000 2000; 15000 12000 11000; 40000 60000 1000; 10000 10000 1000];
    for i = 1:size(config_set, 1)  % Loop over each row (1 to 3)
        pitchTarget = pitchZeroStep - config_set(i, 1);
        yawTarget   = yawZeroStep   - config_set(i, 2);
        gateTarget  = gateZeroStep  - config_set(i, 3);
    
        fprintf("\nExecuting Config %d...\n", i);
        moveto(pitchHandle, pitchTarget);
        moveto(yawHandle, yawTarget);
        moveto(gateHandle, gateTarget);
    
        pause(5);  % Wait 5 seconds between configurations
    end
        

    %Return to zero
    moveto(pitchHandle, pitchZeroStep - 34000);
    moveto(yawHandle, yawZeroStep - 48000);
    moveto(gateHandle, gateZeroStep - 12000);
    % Cleanup
    fprintf('\n');
    cleanup_wrapper(yawConn,pitchConn,gateConn,interfaceConn,yawHandle,pitchHandle,gateHandle,interfaceHandle);

catch ME
    % Cleanup on error
    fprintf('Error in %s at line %d: %s\n', ...
        ME.stack(1).name, ME.stack(1).line, ME.message);
    fprintf('\n');
    cleanup_wrapper(yawConn,pitchConn,gateConn,interfaceConn,yawHandle,pitchHandle,gateHandle,interfaceHandle);
end


%26400 = touching wall next to hole
%4800 = covering hole middle
%0 = touching opposite wall