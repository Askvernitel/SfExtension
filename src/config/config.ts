


export default class Config {
	_serviceOn = true;


	set serviceOn(serviceOn: boolean) {
		this._serviceOn = serviceOn;
	}


	get serviceOn(): boolean {
		return this._serviceOn;
	}
}
