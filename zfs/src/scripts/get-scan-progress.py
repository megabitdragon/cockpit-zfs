import subprocess
import re

def get_scan_progress(pool_name):
    try:
        # Run the zpool status command for the specified pool and capture the output as bytes
        cmd = ['zpool', 'status', pool_name]
        output_bytes = subprocess.check_output(cmd)
        
        # Decode the bytes to a string
        output = output_bytes.decode('utf-8')
        
        # Use regular expressions to search for the scan progress percentage and estimated time remaining
        percentage_match = re.search(r'(\d+\.\d+)% done', output)
        time_remaining_match = re.search(r'(\d+:\d+:\d+) to go', output)
        
        percentage_done = percentage_match.group(1) if percentage_match else None
        time_remaining = time_remaining_match.group(1) if time_remaining_match else None
        
        # Check if time_remaining is "no estimated completion time" and handle it
        if time_remaining and "no estimated completion time" in time_remaining.lower():
            time_remaining = "Not available"
        
        return percentage_done, time_remaining
    except Exception as e:
        print(f"Error: {e}")
        return None, None

# # Input: Pool name (e.g., 'tank')
# pool_name = input("Enter the pool name: ")

# # Call the function to get the scan progress percentage and estimated time remaining
# percentage, time_remaining = get_scan_progress(pool_name)

# if percentage is not None:
#     print(f"Scan Progress Percentage: {percentage}%")
# else:
#     print("Unable to retrieve scan progress percentage.")

# if time_remaining is not None:
#     print(f"Estimated Time Remaining: {time_remaining} to go")
# else:
#     print("Estimated Time Remaining: Not available")
