import React, { Component } from "react";
import "./Content.scss";
import Reports from "../Reports";

class Content extends Component {
	render() {
		return (
			<div id="content">
				<Reports />
			</div>
		);
	}
}

export default Content;