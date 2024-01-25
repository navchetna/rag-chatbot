export http_proxy=http://proxy01.iind.intel.com:912/
export https_proxy=http://proxy01.iind.intel.com:912/
source csuc/bin/activate
python3 -m uvicorn server:app --host 0.0.0.0
