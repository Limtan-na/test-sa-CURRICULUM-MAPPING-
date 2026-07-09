(function () {
  'use strict';

  const API_BASE = 'http://localhost:5000';

  async function fetchStats() {
    try {
      const res = await fetch(API_BASE + '/api/stats');
      const data = await res.json();
      document.getElementById('stat-programs').textContent = data.programs ?? '0';
      document.getElementById('stat-courses').textContent  = data.courses ?? '0';
      document.getElementById('stat-outcomes').textContent = data.outcomes ?? '0';
      document.getElementById('stat-mappings').textContent = data.mappings ?? '0';
    } catch {
      document.querySelectorAll('.stat-value').forEach(el => el.textContent = '--');
    }
  }

  async function initCoverageChart() {
    const container = document.getElementById('chart-coverage');
    if (!container) return;

    let data;
    try {
      const res = await fetch(API_BASE + '/api/charts/coverage');
      data = await res.json();
    } catch {
      data = [
        { outcome: 'PO1', coverage: 85 },
        { outcome: 'PO2', coverage: 70 },
        { outcome: 'PO3', coverage: 90 },
        { outcome: 'PO4', coverage: 60 },
        { outcome: 'PO5', coverage: 75 },
      ];
    }

    const width = container.clientWidth || 400;
    const height = 280;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };

    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const x = d3.scaleBand()
      .domain(data.map(d => d.outcome))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height - margin.bottom, margin.top]);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).suffix('%'));

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.outcome))
      .attr('y', d => y(d.coverage))
      .attr('width', x.bandwidth())
      .attr('height', d => height - margin.bottom - y(d.coverage))
      .attr('fill', '#2d6a9f')
      .attr('rx', 4);
  }

  async function initMappingChart() {
    const container = document.getElementById('chart-mapping');
    if (!container) return;

    let data;
    try {
      const res = await fetch(API_BASE + '/api/charts/mapping-status');
      data = await res.json();
    } catch {
      data = [
        { label: 'Mapped', value: 65, color: '#38a169' },
        { label: 'Partial', value: 25, color: '#d69e2e' },
        { label: 'Unmapped', value: 10, color: '#e53e3e' },
      ];
    }

    const width = container.clientWidth || 400;
    const height = 280;
    const radius = Math.min(width, height) / 2.5;

    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.label))
      .range(data.map(d => d.color));

    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    const legend = svg.selectAll('.legend')
      .data(data)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${radius + 20}, ${i * 25 - 20})`);

    legend.append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', d => color(d.label));

    legend.append('text')
      .attr('x', 18)
      .attr('y', 10)
      .attr('font-size', '12px')
      .text(d => `${d.label} (${d.value}%)`);
  }

  async function initMappingMatrix() {
    const container = document.getElementById('mapping-matrix');
    if (!container) return;

    let data;
    try {
      const res = await fetch(API_BASE + '/api/mapping-matrix');
      data = await res.json();
    } catch {
      container.innerHTML = '<p style="color:#999;text-align:center;padding:40px;">Failed to load mapping data.</p>';
      return;
    }

    if (!data.courses.length || !data.outcomes.length) {
      container.innerHTML = '<p style="color:#999;text-align:center;padding:40px;">No courses or outcomes defined yet.</p>';
      return;
    }

    const levelColors = { 'I': '#d69e2e', 'E': '#38a169', 'D': '#2d6a9f' };
    const levelLabels = { 'I': 'Introduced', 'E': 'Enabling', 'D': 'Demonstrative' };

    const margin = { top: 30, right: 20, bottom: 100, left: 140 };
    const cellSize = 50;
    const width = data.outcomes.length * cellSize + margin.left + margin.right;
    const height = data.courses.length * cellSize + margin.top + margin.bottom;

    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('max-width', '100%')
      .style('overflow', 'visible');

    const heatmap = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(data.outcomes.map(o => o.code))
      .range([0, data.outcomes.length * cellSize])
      .padding(0.05);

    const yScale = d3.scaleBand()
      .domain(data.courses.map(c => c.code))
      .range([0, data.courses.length * cellSize])
      .padding(0.05);

    heatmap.selectAll('rect')
      .data(data.courses.flatMap(c =>
        data.outcomes.map(o => ({
          course: c,
          outcome: o,
          level: data.mappings[`${c.id}-${o.id}`] || null,
        }))
      ))
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.outcome.code))
      .attr('y', d => yScale(d.course.code))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('fill', d => d.level ? levelColors[d.level] : '#f0f0f0')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('rx', 4);

    heatmap.selectAll('text.cell')
      .data(data.courses.flatMap(c =>
        data.outcomes.map(o => ({
          course: c,
          outcome: o,
          level: data.mappings[`${c.id}-${o.id}`] || null,
        }))
      ))
      .enter()
      .append('text')
      .attr('class', 'cell')
      .attr('x', d => xScale(d.outcome.code) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.course.code) + yScale.bandwidth() / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', d => d.level ? '#fff' : '#ccc')
      .text(d => d.level || '—');

    heatmap.append('g')
      .attr('transform', `translate(0, ${data.courses.length * cellSize})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .attr('text-anchor', 'end')
      .attr('dx', '-0.5em')
      .attr('dy', '0.5em')
      .style('font-size', '12px');

    heatmap.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '12px');

    const legend = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${height - 20})`);

    const legendData = [
      { label: 'Introduced (I)', color: '#d69e2e' },
      { label: 'Enabling (E)', color: '#38a169' },
      { label: 'Demonstrative (D)', color: '#2d6a9f' },
      { label: 'Not mapped', color: '#f0f0f0' },
    ];

    legendData.forEach((d, i) => {
      const g = legend.append('g')
        .attr('transform', `translate(${i * 160}, 0)`);
      g.append('rect')
        .attr('width', 14)
        .attr('height', 14)
        .attr('fill', d.color)
        .attr('rx', 3);
      g.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .style('font-size', '11px')
        .text(d.label);
    });
  }

  if (document.getElementById('chart-coverage')) initCoverageChart();
  if (document.getElementById('chart-mapping')) initMappingChart();
  if (document.getElementById('stat-programs')) fetchStats();
  if (document.getElementById('mapping-matrix')) initMappingMatrix();
})();
