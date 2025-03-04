fetch('data.json')
	.then(res => {
		if (!res.ok) throw new Error('Error loading JSON file');
		return res.json();
	})
	.then(data => {
		console.log(data);
		dataLoop(data);
		filterData();
	})
	.catch(err => console.error(`error occurred:`, err));

const dataLoop = data => {
	console.log(data[0]);

	data.forEach(item => {
		const jobContainer = document.querySelector('.job-section');

		const jobLogo = item.logo;
		const jobCompanyName = item.company;
		const jobPostion = item.position;
		const postedAt = item.postedAt;
		const jobLenght = item.contract;
		const jobLocation = item.location;

		const jobLevel = item.level;
		const jobRole = item.role;
		const jobLanguage = item.languages || [];
		const jobTools = item.tools || [];

		//creating new job offer
		const newJob = document.createElement('div');
		newJob.classList.add('job');
		jobContainer.append(newJob);

		const newJobBox = document.createElement('div');
		newJobBox.classList.add('job-box');

		newJob.append(newJobBox);

		//creating loop for tools to choose
		const newJobBoxTools = document.createElement('div');
		newJobBoxTools.classList.add('job-box__tools');

		const itemsToSelect = [jobLevel, jobRole, ...jobLanguage, ...jobTools];

		itemsToSelect.forEach(el => {
			const newToolParagraph = document.createElement('p');
			newToolParagraph.classList.add('job-box__tools--tool');
			newToolParagraph.textContent = el;
			newJobBoxTools.appendChild(newToolParagraph);
		});

		//checking if featured or new
		// creating data container
		const newJobBoxData = document.createElement('div');
		newJobBoxData.classList.add('job-box__data');

		// creating new and feature el
		const newSign = document.createElement('p');
		newSign.classList.add('job-box__data--new');
		newSign.textContent = 'new!';
		newSign.style.display = 'none';

		const featureSign = document.createElement('p');
		featureSign.classList.add('job-box__data--featured');
		featureSign.textContent = 'featured';
		featureSign.style.display = 'none';

		newJobBoxData.appendChild(newSign);
		newJobBoxData.appendChild(featureSign);

		if (item.new === true) {
			newSign.style.display = 'block';
		}
		if (item.featured === true) {
			featureSign.style.display = 'block';
		}

		if (item.new === true) {
			newSign.style.display = 'block';
		} else {
			newSign.style.display = 'none';
		}

		if (item.featured === true) {
			featureSign.style.display = 'block';
			newJob.classList.add('featured');
		} else {
			featureSign.style.display = 'none';
		}

		newJobBox.innerHTML = `
				<div class="left-panel">
					<img src="${jobLogo}" alt="company logo" class="company-logo" />
					<div>
						<div class="job-box__data">
							<p class="job-box__data--company">${jobCompanyName}</p>
							
						</div>
						<p class="job-box__position">${jobPostion}</p>
						<div class="job-box__status">
							<p class="job-box__status--posted">${postedAt}</p>
							<p class="job-box__status--lenght">${jobLenght}</p>
							<p class="job-box__status--coutnry">${jobLocation}</p>
						</div>
					</div>
				</div>
				<hr />
				<div class="right-panel">
				</div>
			`;

		newJobBox.querySelector('.right-panel').appendChild(newJobBoxTools);
		newJobBox.querySelector('.job-box__data').appendChild(newSign);
		newJobBox.querySelector('.job-box__data').appendChild(featureSign);
	});
};

const filterData = () => {
	const filterItems = document.querySelectorAll('.job-box__tools--tool');
	const filterBar = document.querySelector('.filter-bar');
	const filterBox = document.querySelector('.filter-box');
	const clearBtn = document.querySelector('.clear-btn');

	const refilteringJobItems = () => {
		const selectedFilters = [
			...filterBox.querySelectorAll('.filter__item--txt'),
		].map(el => el.textContent);
		const jobBoxes = document.querySelectorAll('.job');

		jobBoxes.forEach(job => {
			const jobTools = [...job.querySelectorAll('.job-box__tools--tool')];

			let matches = selectedFilters.some(filter =>
				jobTools.some(tool => tool.textContent === filter)
			);

			if (matches || selectedFilters.length === 0) {
				job.classList.add('active');
				job.style.opacity = '1';
				job.style.pointerEvents = 'auto';
				job.style.position = 'static';

				// adding 'active' class to matching elements
				jobTools.forEach(tool => {
					if (selectedFilters.includes(tool.textContent)) {
						tool.classList.add('active');
					} else {
						tool.classList.remove('active');
					}
				});
			} else {
				job.classList.remove('active');
				job.style.opacity = '0';
				job.style.pointerEvents = 'none';
				job.style.position = 'absolute';
				jobTools.forEach(tool => tool.classList.remove('active'));
			}
		});
	};

	filterItems.forEach(item => {
		item.addEventListener('click', e => {
			filterBar.style.opacity = '1';

			const newFilterItem = document.createElement('div');
			newFilterItem.classList.add('filter__item');
			newFilterItem.innerHTML = `
				<p class="filter__item--txt">${e.target.textContent}</p>
				<i class="fa-solid fa-xmark"></i>
			`;

			filterBox.appendChild(newFilterItem);
			refilteringJobItems();

			newFilterItem.querySelector('.fa-xmark').addEventListener('click', () => {
				newFilterItem.remove();

				refilteringJobItems(); //refilter after removing a filter
			});

			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	});

	clearBtn.addEventListener('click', () => {
		filterBox.innerHTML = ``;
		filterBar.style.opacity = '0';
		refilteringJobItems();
	});
};
