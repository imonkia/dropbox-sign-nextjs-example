'use client'

import { createEmbeddedSignatureRequest } from '@/lib/signature_request';
import { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import HelloSign from 'hellosign-embedded';

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;

const EmbeddedSignatureRequest = () => {
	const [ signButton, setSignButton ] = useState<boolean>(false);
	const [ createSignButton, setCreateSignButton ] = useState<boolean>(true);
	const [ signUrl, setSignUrl ] = useState<string>('');
	const [ signerName, setSignerName ] = useState<string>('');
	const [ signerEmail, setSignerEmail ] = useState<string>('');
	const [ isWaiting, setIsWaiting ] = useState<boolean>(false);
	const [ errorMessage, setErrorMessage ] = useState<string>('');

	useEffect(() => {
		if(signerName && signerEmail && /.+@.+\..+/.test(signerEmail)) {
			setCreateSignButton(false);
		} else {
			setCreateSignButton(true)
		};
	}, [signerName, signerEmail]);
	
	const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
		e.target.name === "signerName" && setSignerName(e.target.value);
		e.target.name === "signerEmailAddress" && setSignerEmail(e.target.value);
	};
	
	const sendSignatureRequest = async (e: MouseEvent<HTMLElement>) => {	
		e.preventDefault();
		setIsWaiting(true);
		const response: any = await createEmbeddedSignatureRequest(signerName, signerEmail).then(res => res);
		if(response.signUrl) { 
			setSignUrl(response.signUrl);
			setIsWaiting(false);
			setSignButton(true);
			setCreateSignButton(true);
			setSignerEmail('');
			setSignerName('');
			setErrorMessage('');
		} else {
			setErrorMessage(response.errorMsg);
			setIsWaiting(false);
		};
	};

	const signDocument = async (e: MouseEvent<HTMLElement>) => {
		e.preventDefault();
		const client = new HelloSign();
		client.open(signUrl, {
			skipDomainVerification: true,
			testMode: true,
			clientId: clientId,
			container: document.getElementById('esig-container')!,
			debug: true
		});

		client.on('ready', data => setSignButton(false));
		client.on('close', () => {
			console.log('iFrame closed.\n');
			setSignUrl('');
		});
		client.on('sign', () => {
			setTimeout(() => {
				client.close();
			}, 5000)
		});
		client.on('decline', () => console.log('Signature request declined.\n'));
	};
	
	return (
		<div className="h-dvh p-10">		
			<h1 className="text-xl mb-7">Create a Test Signature Request</h1>
			<div className="h-4/5 flex flex-row justify-between">	
				<div className="flex flex-col">
					<form>
						<label htmlFor="name" className="text-sm text-neutral-600">Enter the Signer&apos;s Name:</label>
						<input value={signerName} className="rounded-md w-full mb-5 p-2 h-10" type="text" name="signerName" onChange={e => handleOnChange(e)} required/><br/>
						<label htmlFor="email" className="text-sm text-neutral-600">Enter the Signer&apos;s Email:</label>
						<input value={signerEmail} className="rounded-md w-full p-2 h-10" type="text" name="signerEmailAddress" onChange={e => handleOnChange(e)} required/><br/>
						<div className="mt-10">
							<button className={`bg-neutral-700 text-sm w-auto p-2 rounded-lg mr-5 ${createSignButton ? 'text-neutral-100 opacity-25' : ' text-white'}`} onClick={sendSignatureRequest} disabled={createSignButton}>{isWaiting ? "Waiting..." : "Create Signature Request"}</button>
							{signButton ? 
								<button className="bg-neutral-700 w-auto text-sm text-white p-2 rounded-lg" onClick={signDocument}>Document Ready to Sign!</button>
								:
								<button className="bg-neutral-700 text-sm text-neutral-100 opacity-25 p-2 rounded-lg" disabled>No Document Available</button>
							}
						</div>	
					</form>
					{errorMessage && 
						<div className="mt-10 rounded-md bg-rose-900/25 p-2">
							<p className="text-lg text-rose-800 text-center">{errorMessage}</p>
						</div>
					}
				</div>
				<div id="esig-container" className="bg-white w-3/4 text-2xl justify-self-end"></div>
			</div>
		</div>
	);
};

export default EmbeddedSignatureRequest;