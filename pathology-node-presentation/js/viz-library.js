/* ============================================================
   Lecture Visualization Library — D3.js visualizations
   Each function takes a container DOM element and optional config
   ============================================================ */

const VizLibrary = (function () {

    // ─── WORKFLOW PIPELINE (three-phase) ─────────────────────
    function workflowPipeline(container, config) {
        var W = 1050, H = 340;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var phases = (config && config.phases) || [
            { label: 'Pre-Analytical', color: '#3498db',
              steps: ['Order', 'Collection', 'Labeling', 'Accessioning'] },
            { label: 'Analytical', color: '#27ae60',
              steps: ['Grossing', 'Processing', 'Slide Creation', 'Staining'] },
            { label: 'Post-Analytical', color: '#9b59b6',
              steps: ['Interpretation', 'Reporting', 'Distribution', 'Follow-up'] }
        ];

        var phaseW = 330, gap = 24, stepH = 36, stepGap = 8;
        var stepW = phaseW - 30;

        phases.forEach(function (phase, pi) {
            var px = pi * (phaseW + gap) + 12;
            var g = svg.append('g').style('opacity', 0);

            g.append('rect').attr('x', px).attr('y', 0)
                .attr('width', phaseW).attr('height', H - 10)
                .attr('rx', 12).attr('fill', phase.color).attr('fill-opacity', 0.08)
                .attr('stroke', phase.color).attr('stroke-opacity', 0.3).attr('stroke-width', 1.5);

            g.append('text').attr('x', px + phaseW / 2).attr('y', 30)
                .attr('text-anchor', 'middle').attr('font-size', '15px')
                .attr('font-weight', '700').attr('fill', phase.color)
                .text(phase.label);

            phase.steps.forEach(function (step, si) {
                var sx = px + 15;
                var sy = 50 + si * (stepH + stepGap);

                g.append('rect').attr('x', sx).attr('y', sy)
                    .attr('width', stepW).attr('height', stepH)
                    .attr('rx', 8).attr('fill', 'white')
                    .attr('stroke', phase.color).attr('stroke-width', 1.5);

                g.append('text').attr('x', sx + stepW / 2).attr('y', sy + stepH / 2 + 5)
                    .attr('text-anchor', 'middle').attr('font-size', '13px')
                    .attr('fill', '#0e6e8c').text(step);

                if (si < phase.steps.length - 1) {
                    var ay = sy + stepH + 2;
                    g.append('path')
                        .attr('d', 'M' + (sx + stepW / 2 - 5) + ',' + ay +
                              ' L' + (sx + stepW / 2) + ',' + (ay + stepGap - 2) +
                              ' L' + (sx + stepW / 2 + 5) + ',' + ay)
                        .attr('fill', phase.color).attr('opacity', 0.5);
                }
            });

            g.transition().delay(pi * 400).duration(600).style('opacity', 1);
        });

        for (var i = 0; i < 2; i++) {
            var ax = (i + 1) * (phaseW + gap) - gap / 2 + 12;
            svg.append('text').attr('x', ax).attr('y', H / 2)
                .attr('text-anchor', 'middle').attr('font-size', '24px')
                .attr('fill', '#bdc3c7').text('\u2192')
                .style('opacity', 0)
                .transition().delay(800 + i * 300).duration(400).style('opacity', 1);
        }
    }

    // ─── ABSTRACTION LAYERS (car analogy) ────────────────────
    function abstractionLayers(container, config) {
        var W = 1000, H = 420;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var layerH = 56, gap = 10, colW = 420;
        var topStart = 44;                          // y where layer boxes begin
        var topEnd = topStart + 2 * layerH + gap;   // bottom of 2nd layer box
        var annotY = topEnd + 26;                    // "FOCUS HERE" text baseline
        var botStart = annotY + 18;                  // top of 3rd layer box

        var carLayers = [
            { label: 'Driver', sub: 'Where you want to go, how fast', color: '#2980b9' },
            { label: 'Controls', sub: 'Steering, pedals, dashboard', color: '#3498db' },
            { label: 'Drivetrain', sub: 'Engine, transmission, electronics', color: '#5dade2' },
            { label: 'Components', sub: 'Chips, sensors, fuel injectors', color: '#85c1e9' }
        ];
        var pathLayers = [
            { label: 'Pathologist', sub: 'Diagnosis, workflow decisions', color: '#27ae60' },
            { label: 'Workflow & Logic', sub: 'Rules, validations, distribution', color: '#2ecc71' },
            { label: 'Systems', sub: 'LIS, viewers, interfaces, middleware', color: '#58d68d' },
            { label: 'Infrastructure', sub: 'Servers, CPUs, networks, storage', color: '#82e0aa' }
        ];

        // Focus bracket — covers the top two layers
        var bracketTop = topStart - 8;
        var bracketH = topEnd - bracketTop + 8;
        svg.append('rect').attr('x', 0).attr('y', bracketTop)
            .attr('width', W).attr('height', bracketH)
            .attr('rx', 14).attr('fill', 'rgba(41,128,185,0.06)')
            .attr('stroke', '#2980b9').attr('stroke-dasharray', '6,4')
            .attr('stroke-width', 1.5);

        // Annotation line + text between top and bottom layers
        svg.append('line')
            .attr('x1', 40).attr('x2', W - 40)
            .attr('y1', annotY - 10).attr('y2', annotY - 10)
            .attr('stroke', '#2980b9').attr('stroke-width', 1)
            .attr('stroke-dasharray', '4,3').attr('opacity', 0.5);

        svg.append('text').attr('x', W / 2).attr('y', annotY + 4)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#2980b9').attr('font-weight', '600')
            .text('\u25B2 FOCUS HERE \u2014 the abstraction layers that matter for clinical practice');

        function drawCol(layers, xOff, title, emoji) {
            var g = svg.append('g');
            g.append('text').attr('x', xOff + colW / 2).attr('y', 28)
                .attr('text-anchor', 'middle').attr('font-size', '15px')
                .attr('font-weight', '700').attr('fill', '#0e6e8c')
                .text(emoji + '  ' + title);

            layers.forEach(function (layer, i) {
                // Top 2 layers above annotation, bottom 2 below
                var y = i < 2
                    ? topStart + i * (layerH + gap)
                    : botStart + (i - 2) * (layerH + gap);

                var lg = g.append('g').style('opacity', 0);

                lg.append('rect').attr('x', xOff).attr('y', y)
                    .attr('width', colW).attr('height', layerH)
                    .attr('rx', 10).attr('fill', layer.color).attr('fill-opacity', 0.15)
                    .attr('stroke', layer.color).attr('stroke-width', 2);

                lg.append('text').attr('x', xOff + 18).attr('y', y + 24)
                    .attr('font-size', '15px').attr('font-weight', '700')
                    .attr('fill', layer.color).text(layer.label);

                lg.append('text').attr('x', xOff + 18).attr('y', y + 43)
                    .attr('font-size', '12px').attr('fill', '#555').text(layer.sub);

                var targetOpacity = i < 2 ? 1.0 : 0.35;
                lg.transition().delay(i * 250 + 200).duration(500).style('opacity', targetOpacity);
            });
        }

        drawCol(carLayers, 20, 'Driving a Car', '\uD83D\uDE97');
        drawCol(pathLayers, W - colW - 20, 'Practicing Pathology', '\uD83D\uDD2C');

        // Equivalence symbol between columns (vertically centered on top layers)
        var eqY = topStart + layerH + gap / 2;
        svg.append('text').attr('x', W / 2).attr('y', eqY + 6)
            .attr('text-anchor', 'middle').attr('font-size', '30px')
            .attr('fill', '#bdc3c7').text('\u2248');
    }

    // ─── SYSTEMS ECOSYSTEM ───────────────────────────────────
    function systemsEcosystem(container, config) {
        var W = 950, H = 420;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var nodes = [
            { id: 'LIS', label: 'LIS', r: 44, color: '#2980b9' },
            { id: 'scanners', label: 'Instrument\nInterfaces', r: 30, color: '#27ae60' },
            { id: 'imaging', label: 'Image Mgmt\n/ Viewer', r: 30, color: '#8e44ad' },
            { id: 'dictation', label: 'Dictation &\nReporting', r: 30, color: '#e67e22' },
            { id: 'middleware', label: 'Middleware', r: 28, color: '#16a085' },
            { id: 'portals', label: 'Portals /\nDashboards', r: 28, color: '#2c3e50' },
            { id: 'warehouse', label: 'Data\nWarehouse', r: 30, color: '#c0392b' },
            { id: 'messaging', label: 'Messaging /\nNotifications', r: 28, color: '#f39c12' },
            { id: 'ai', label: 'AI / ML\nModels', r: 28, color: '#e74c3c' }
        ];

        var links = [
            { source: 'LIS', target: 'scanners' },
            { source: 'LIS', target: 'imaging' },
            { source: 'LIS', target: 'dictation' },
            { source: 'LIS', target: 'middleware' },
            { source: 'LIS', target: 'portals' },
            { source: 'LIS', target: 'warehouse' },
            { source: 'LIS', target: 'messaging' },
            { source: 'LIS', target: 'ai' },
            { source: 'imaging', target: 'ai' },
            { source: 'warehouse', target: 'ai' },
            { source: 'middleware', target: 'scanners' }
        ];

        var cx = W / 2, cy = H / 2, radius = 170;
        nodes[0].x = cx; nodes[0].y = cy;
        var outer = nodes.slice(1);
        outer.forEach(function (n, i) {
            var angle = (i / outer.length) * 2 * Math.PI - Math.PI / 2;
            n.x = cx + radius * Math.cos(angle);
            n.y = cy + radius * Math.sin(angle);
        });

        var nodeMap = {};
        nodes.forEach(function (n) { nodeMap[n.id] = n; });

        svg.selectAll('.eco-link')
            .data(links).enter()
            .append('line')
            .attr('x1', function (d) { return nodeMap[d.source].x; })
            .attr('y1', function (d) { return nodeMap[d.source].y; })
            .attr('x2', function (d) { return nodeMap[d.target].x; })
            .attr('y2', function (d) { return nodeMap[d.target].y; })
            .attr('stroke', '#bdc3c7').attr('stroke-width', 2)
            .style('opacity', 0)
            .transition().delay(function (d, i) { return 300 + i * 80; }).duration(400)
            .style('opacity', 0.4);

        var nodeGs = svg.selectAll('.eco-node')
            .data(nodes).enter()
            .append('g')
            .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')'; })
            .style('opacity', 0);

        nodeGs.append('circle')
            .attr('r', function (d) { return d.r; })
            .attr('fill', function (d) { return d.color; }).attr('fill-opacity', 0.15)
            .attr('stroke', function (d) { return d.color; }).attr('stroke-width', 2.5);

        nodeGs.each(function (d) {
            var lines = d.label.split('\n');
            var g = d3.select(this);
            lines.forEach(function (line, i) {
                g.append('text')
                    .attr('y', (i - (lines.length - 1) / 2) * 13 + 4)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', d.id === 'LIS' ? '16px' : '10px')
                    .attr('font-weight', d.id === 'LIS' ? '800' : '600')
                    .attr('fill', d.color)
                    .text(line);
            });
        });

        nodeGs.transition().delay(function (d, i) { return i * 150; }).duration(500)
            .style('opacity', 1);
    }

    // ─── AI MATURITY LADDER ──────────────────────────────────
    function aiMaturityLadder(container, config) {
        var W = 950, H = 360;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var levels = [
            { label: 'Level IV: Integrated Decision Support', sub: 'Differential generation, risk stratification', color: '#8e44ad', icon: '\uD83E\uDDE0' },
            { label: 'Level III: Assistive AI', sub: 'Flagging, quantification, draft reports', color: '#e74c3c', icon: '\uD83E\uDD16' },
            { label: 'Level II: Real-time QA & Safety', sub: 'Mismatch detection, missing fields, hard stops', color: '#f39c12', icon: '\uD83D\uDEE1\uFE0F' },
            { label: 'Level I: Retrospective Analytics', sub: 'TAT reports, volumes, trends', color: '#27ae60', icon: '\uD83D\uDCCA' }
        ];

        var stepH = 68, baseW = 860, narrowing = 100;

        levels.forEach(function (level, i) {
            var w = baseW - i * narrowing;
            var x = (W - w) / 2;
            var y = H - (levels.length - i) * (stepH + 6);

            var g = svg.append('g').style('opacity', 0);

            g.append('rect').attr('x', x).attr('y', y)
                .attr('width', w).attr('height', stepH)
                .attr('rx', 10).attr('fill', level.color).attr('fill-opacity', 0.12)
                .attr('stroke', level.color).attr('stroke-width', 2);

            g.append('text').attr('x', x + 44).attr('y', y + 30)
                .attr('font-size', '14px').attr('font-weight', '700')
                .attr('fill', level.color).text(level.label);

            g.append('text').attr('x', x + 44).attr('y', y + 50)
                .attr('font-size', '11px').attr('fill', '#555').text(level.sub);

            g.append('text').attr('x', x + 18).attr('y', y + 40)
                .attr('font-size', '20px').text(level.icon);

            g.transition().delay((levels.length - 1 - i) * 350).duration(500).style('opacity', 1);
        });
    }

    // ─── DATA FLOW PIPELINE ──────────────────────────────────
    function dataFlow(container, config) {
        var W = 1000, H = 160;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var steps = ['Capture', 'Map', 'Store', 'Clean', 'Present', 'Interpret', 'Act'];
        var colors = ['#3498db', '#2980b9', '#1abc9c', '#27ae60', '#f39c12', '#e67e22', '#e74c3c'];
        var stepW = 110, gapX = 18;
        var startX = (W - steps.length * (stepW + gapX) + gapX) / 2;

        steps.forEach(function (step, i) {
            var x = startX + i * (stepW + gapX);
            var g = svg.append('g').style('opacity', 0);

            g.append('rect').attr('x', x).attr('y', 30)
                .attr('width', stepW).attr('height', 50)
                .attr('rx', 10).attr('fill', colors[i]).attr('fill-opacity', 0.15)
                .attr('stroke', colors[i]).attr('stroke-width', 2);

            g.append('text').attr('x', x + stepW / 2).attr('y', 60)
                .attr('text-anchor', 'middle').attr('font-size', '13px')
                .attr('font-weight', '600').attr('fill', colors[i]).text(step);

            if (i < steps.length - 1) {
                g.append('text').attr('x', x + stepW + gapX / 2).attr('y', 60)
                    .attr('text-anchor', 'middle').attr('font-size', '18px')
                    .attr('fill', '#bdc3c7').text('\u2192');
            }

            if (i > 0 && i < steps.length - 1) {
                g.append('text').attr('x', x - gapX / 2).attr('y', 105)
                    .attr('text-anchor', 'middle').attr('font-size', '9px')
                    .attr('fill', '#e74c3c').attr('font-weight', '600').text('\u26A0 interface');
            }

            g.transition().delay(i * 180).duration(400).style('opacity', 1);
        });

        svg.append('text').attr('x', W / 2).attr('y', 140)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#e74c3c').attr('font-style', 'italic')
            .text('Failures cluster at interfaces, not in isolated steps');
    }

    // ─── AUTOMATION MATURITY LADDER ──────────────────────────
    function automationLadder(container, config) {
        var W = 900, H = 260;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var levels = [
            { label: 'Level III: Guidance', sub: 'Dynamic worklists, exception triage, "falling behind" detection', color: '#8e44ad' },
            { label: 'Level II: Prevention', sub: 'Constraints + safety checks (prevent known harms)', color: '#f39c12' },
            { label: 'Level I: Tracking', sub: 'Audit events (what happened, when)', color: '#27ae60' }
        ];

        var stepH = 58, baseW = 800, narrowing = 120;

        levels.forEach(function (level, i) {
            var w = baseW - i * narrowing;
            var x = (W - w) / 2;
            var y = H - (levels.length - i) * (stepH + 8);

            var g = svg.append('g').style('opacity', 0);

            g.append('rect').attr('x', x).attr('y', y)
                .attr('width', w).attr('height', stepH)
                .attr('rx', 10).attr('fill', level.color).attr('fill-opacity', 0.12)
                .attr('stroke', level.color).attr('stroke-width', 2);

            g.append('text').attr('x', x + 18).attr('y', y + 25)
                .attr('font-size', '14px').attr('font-weight', '700')
                .attr('fill', level.color).text(level.label);

            g.append('text').attr('x', x + 18).attr('y', y + 45)
                .attr('font-size', '11px').attr('fill', '#555').text(level.sub);

            g.transition().delay((levels.length - 1 - i) * 350).duration(500).style('opacity', 1);
        });
    }

    // ─── PHASE COMPARISON (CP ✓ vs AP ?) ─────────────────────
    function phaseComparison(container, config) {
        var W = 1060, H = 380;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var colW = 500, gap = 60;
        var phaseW = 150, phaseH = 260, phaseGap = 10;
        var colors = ['#3498db', '#27ae60', '#9b59b6'];
        var phaseLabels = ['Pre-Analytical', 'Analytical', 'Post-Analytical'];

        // ── LEFT: Clinical Chemistry (clean) ──
        var lx = 0;
        var lg = svg.append('g').style('opacity', 0);
        lg.append('text').attr('x', lx + colW / 2).attr('y', 24)
            .attr('text-anchor', 'middle').attr('font-size', '15px')
            .attr('font-weight', '700').attr('fill', '#0e6e8c')
            .text('Clinical Chemistry  ✓');

        var cpSteps = [
            ['Order entry', 'Collection', 'Transport', 'Accessioning'],
            ['Instrument analysis', '(single automated step)'],
            ['Result review', 'Reporting', 'Distribution']
        ];

        phaseLabels.forEach(function (label, pi) {
            var px = lx + pi * (phaseW + phaseGap) + 20;
            lg.append('rect').attr('x', px).attr('y', 40)
                .attr('width', phaseW).attr('height', phaseH)
                .attr('rx', 10).attr('fill', colors[pi]).attr('fill-opacity', 0.08)
                .attr('stroke', colors[pi]).attr('stroke-opacity', 0.4).attr('stroke-width', 1.5);

            lg.append('text').attr('x', px + phaseW / 2).attr('y', 62)
                .attr('text-anchor', 'middle').attr('font-size', '11px')
                .attr('font-weight', '700').attr('fill', colors[pi]).text(label);

            cpSteps[pi].forEach(function (step, si) {
                lg.append('text').attr('x', px + phaseW / 2).attr('y', 88 + si * 22)
                    .attr('text-anchor', 'middle').attr('font-size', '11px')
                    .attr('fill', '#555').text(step);
            });
        });

        // Clean dividers between phases
        for (var di = 0; di < 2; di++) {
            var dx = lx + (di + 1) * (phaseW + phaseGap) + 20 - phaseGap / 2;
            lg.append('text').attr('x', dx).attr('y', 170)
                .attr('text-anchor', 'middle').attr('font-size', '18px')
                .attr('fill', '#bdc3c7').text('→');
        }

        lg.append('text').attr('x', lx + colW / 2).attr('y', H - 30)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#27ae60').attr('font-weight', '600')
            .text('Clean boundaries — each step belongs to exactly one phase');

        lg.transition().duration(600).style('opacity', 1);

        // ── RIGHT: Anatomic Pathology (blurred) ──
        var rx = colW + gap;
        var rg = svg.append('g').style('opacity', 0);
        rg.append('text').attr('x', rx + colW / 2).attr('y', 24)
            .attr('text-anchor', 'middle').attr('font-size', '15px')
            .attr('font-weight', '700').attr('fill', '#0e6e8c')
            .text('Anatomic Pathology  ?');

        var apSteps = [
            ['Order entry', 'Collection', 'Transport'],
            ['Grossing ←→', 'Processing', 'Slide creation', 'Staining', 'Interpretation', 'Sign-out'],
            ['Reporting', 'Distribution', 'Recuts / rescans ←→', 'Follow-up']
        ];

        phaseLabels.forEach(function (label, pi) {
            var px = rx + pi * (phaseW + phaseGap) + 20;
            var h = pi === 1 ? phaseH + 20 : phaseH - 10;
            var y = pi === 1 ? 30 : 50;

            rg.append('rect').attr('x', px).attr('y', y)
                .attr('width', phaseW).attr('height', h)
                .attr('rx', 10).attr('fill', colors[pi]).attr('fill-opacity', 0.08)
                .attr('stroke', colors[pi]).attr('stroke-opacity', 0.4).attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '6,3');

            rg.append('text').attr('x', px + phaseW / 2).attr('y', y + 22)
                .attr('text-anchor', 'middle').attr('font-size', '11px')
                .attr('font-weight', '700').attr('fill', colors[pi]).text(label);

            apSteps[pi].forEach(function (step, si) {
                var isOverlap = (step.indexOf('←→') >= 0);
                rg.append('text').attr('x', px + phaseW / 2).attr('y', y + 46 + si * 22)
                    .attr('text-anchor', 'middle').attr('font-size', '11px')
                    .attr('fill', isOverlap ? '#e74c3c' : '#555')
                    .attr('font-weight', isOverlap ? '700' : '400')
                    .text(step);
            });
        });

        // Full-width BLUR overlay spanning all three AP phases
        var blurX = rx + 14;
        var blurW = 3 * phaseW + 2 * phaseGap + 12;
        rg.append('rect').attr('x', blurX).attr('y', 70)
            .attr('width', blurW).attr('height', 200).attr('rx', 10)
            .attr('fill', '#e74c3c').attr('fill-opacity', 0.04)
            .attr('stroke', '#e74c3c').attr('stroke-dasharray', '6,4')
            .attr('stroke-width', 1.5).attr('stroke-opacity', 0.5);
        rg.append('text').attr('x', blurX + blurW / 2).attr('y', 286)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#e74c3c').attr('font-weight', '700')
            .text('BOUNDARIES BLUR — activities cross phases');

        rg.append('text').attr('x', rx + colW / 2).attr('y', H - 30)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#e74c3c').attr('font-weight', '600')
            .text('Grossing, staining, recuts, rescans — all straddle phases');

        rg.transition().delay(500).duration(600).style('opacity', 1);

        // Center divider
        svg.append('line').attr('x1', colW + gap / 2).attr('x2', colW + gap / 2)
            .attr('y1', 10).attr('y2', H - 10)
            .attr('stroke', '#e0e5eb').attr('stroke-width', 1).attr('stroke-dasharray', '4,4');
    }

    // ─── CASE TIMELINE (horizontal step chain with delays) ──
    function caseTimeline(container, config) {
        var steps = (config && config.steps) || [];
        var n = steps.length;
        var W = 1060, H = 340;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Two-row layout for 13 steps
        var row1Count = Math.ceil(n / 2);
        var row2Count = n - row1Count;
        var boxW = 72, boxH = 34, gapX = 8, rowGap = 100;
        var row1Y = 40, row2Y = row1Y + rowGap;

        function boxX(col, rowCount) {
            var totalW = rowCount * boxW + (rowCount - 1) * gapX;
            var startX = (W - totalW) / 2;
            return startX + col * (boxW + gapX);
        }

        steps.forEach(function (step, i) {
            var isRow1 = i < row1Count;
            var col = isRow1 ? i : (i - row1Count);
            var rowCount = isRow1 ? row1Count : row2Count;
            var x = boxX(col, rowCount);
            var y = isRow1 ? row1Y : row2Y;

            var g = svg.append('g').style('opacity', 0);

            var isDelay = !!step.delay;
            var fillColor = isDelay ? 'rgba(231,76,60,0.12)' : 'rgba(41,128,185,0.06)';
            var strokeColor = isDelay ? '#e74c3c' : '#bdc3c7';
            var strokeW = isDelay ? 2 : 1.5;

            g.append('rect').attr('x', x).attr('y', y)
                .attr('width', boxW).attr('height', boxH)
                .attr('rx', 6).attr('fill', fillColor)
                .attr('stroke', strokeColor).attr('stroke-width', strokeW);

            g.append('text').attr('x', x + boxW / 2).attr('y', y + boxH / 2 + 4)
                .attr('text-anchor', 'middle').attr('font-size', '9px')
                .attr('font-weight', '600')
                .attr('fill', isDelay ? '#e74c3c' : '#0e6e8c')
                .text(step.label);

            // Time label below box
            if (step.minutes > 0) {
                var timeStr = step.minutes >= 60
                    ? (step.minutes / 60).toFixed(0) + 'h'
                    : step.minutes + 'm';
                g.append('text').attr('x', x + boxW / 2).attr('y', y + boxH + 14)
                    .attr('text-anchor', 'middle').attr('font-size', '8px')
                    .attr('fill', '#999').text(timeStr);
            }

            // Delay callout
            if (isDelay && step.delayNote) {
                var noteY = isRow1 ? y - 14 : y + boxH + 26;
                g.append('text').attr('x', x + boxW / 2).attr('y', noteY)
                    .attr('text-anchor', 'middle').attr('font-size', '8px')
                    .attr('fill', '#e74c3c').attr('font-weight', '600')
                    .text('⚠ ' + step.delayNote);
            }

            // Arrow to next step in same row
            var nextInRow = isRow1 ? (i + 1 < row1Count) : (i + 1 < n);
            if (nextInRow && !(isRow1 && i + 1 === row1Count)) {
                g.append('text')
                    .attr('x', x + boxW + gapX / 2).attr('y', y + boxH / 2 + 4)
                    .attr('text-anchor', 'middle').attr('font-size', '12px')
                    .attr('fill', '#bdc3c7').text('→');
            }

            g.transition().delay(i * 80).duration(300).style('opacity', 1);
        });

        // Curved arrow from end of row 1 down to start of row 2
        if (row2Count > 0) {
            var endX1 = boxX(row1Count - 1, row1Count) + boxW;
            var startX2 = boxX(0, row2Count);
            svg.append('path')
                .attr('d', 'M' + endX1 + ',' + (row1Y + boxH / 2) +
                    ' C' + (endX1 + 40) + ',' + (row1Y + boxH / 2) +
                    ' ' + (endX1 + 40) + ',' + (row2Y + boxH / 2) +
                    ' ' + (endX1) + ',' + (row2Y + boxH / 2))
                .attr('fill', 'none').attr('stroke', '#bdc3c7')
                .attr('stroke-width', 1.5).attr('stroke-dasharray', '4,3')
                .attr('marker-end', 'none');

            // Horizontal connector to row 2 first box if needed
            if (startX2 < endX1) {
                svg.append('line')
                    .attr('x1', endX1).attr('y1', row2Y + boxH / 2)
                    .attr('x2', boxX(row2Count - 1, row2Count) + boxW + 5).attr('y2', row2Y + boxH / 2)
                    .attr('stroke', 'none');
            }
        }

        // Legend
        svg.append('rect').attr('x', 20).attr('y', H - 40).attr('width', 14).attr('height', 14)
            .attr('rx', 3).attr('fill', 'rgba(231,76,60,0.12)').attr('stroke', '#e74c3c').attr('stroke-width', 1.5);
        svg.append('text').attr('x', 40).attr('y', H - 29)
            .attr('font-size', '10px').attr('fill', '#e74c3c').attr('font-weight', '600')
            .text('Delay / breakpoint');

        svg.append('rect').attr('x', 170).attr('y', H - 40).attr('width', 14).attr('height', 14)
            .attr('rx', 3).attr('fill', 'rgba(41,128,185,0.06)').attr('stroke', '#bdc3c7').attr('stroke-width', 1.5);
        svg.append('text').attr('x', 190).attr('y', H - 29)
            .attr('font-size', '10px').attr('fill', '#888')
            .text('Normal step');
    }

    // ─── MEASUREMENT INTERVALS (relay race + error types) ────
    function measurementIntervals(container, config) {
        var steps = (config && config.steps) || [];
        var errorTypes = (config && config.errorTypes) || [];
        var W = 1060, H = 380;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // ── Top row: step chain as relay race with split times ──
        var n = steps.length;
        var boxW = 76, boxH = 30, gapX = 12;
        var totalW = n * boxW + (n - 1) * gapX;
        var startX = (W - totalW) / 2;
        var chainY = 30;

        steps.forEach(function (step, i) {
            var x = startX + i * (boxW + gapX);
            var g = svg.append('g').style('opacity', 0);

            g.append('rect').attr('x', x).attr('y', chainY)
                .attr('width', boxW).attr('height', boxH)
                .attr('rx', 5).attr('fill', 'rgba(14,110,140,0.08)')
                .attr('stroke', '#0e6e8c').attr('stroke-width', 1.5);

            g.append('text').attr('x', x + boxW / 2).attr('y', chainY + boxH / 2 + 4)
                .attr('text-anchor', 'middle').attr('font-size', '8px')
                .attr('font-weight', '600').attr('fill', '#0e6e8c')
                .text(step);

            // Interval bracket below
            if (i < n - 1) {
                var midX = x + boxW + gapX / 2;
                g.append('text').attr('x', midX).attr('y', chainY + boxH / 2 + 4)
                    .attr('text-anchor', 'middle').attr('font-size', '11px')
                    .attr('fill', '#bdc3c7').text('→');

                // Small clock icon for measurable interval
                g.append('text').attr('x', midX).attr('y', chainY + boxH + 16)
                    .attr('text-anchor', 'middle').attr('font-size', '8px')
                    .attr('fill', '#999').text('⏱');
            }

            g.transition().delay(i * 60).duration(300).style('opacity', 1);
        });

        // ── Bottom section: error type cards ──
        var cardY = chainY + boxH + 50;
        var cardW = (W - 80) / errorTypes.length;
        var cardGap = 20;

        errorTypes.forEach(function (et, ei) {
            var cx = 20 + ei * (cardW + cardGap);
            var g = svg.append('g').style('opacity', 0);

            g.append('rect').attr('x', cx).attr('y', cardY)
                .attr('width', cardW).attr('height', H - cardY - 20)
                .attr('rx', 10).attr('fill', et.color).attr('fill-opacity', 0.06)
                .attr('stroke', et.color).attr('stroke-opacity', 0.3).attr('stroke-width', 1.5);

            g.append('text').attr('x', cx + 14).attr('y', cardY + 26)
                .attr('font-size', '14px').attr('font-weight', '700').attr('fill', et.color)
                .text(et.icon + '  ' + et.label);

            et.items.forEach(function (item, ii) {
                g.append('text').attr('x', cx + 22).attr('y', cardY + 52 + ii * 24)
                    .attr('font-size', '12px').attr('fill', '#444')
                    .text('• ' + item);
            });

            g.transition().delay(400 + ei * 300).duration(500).style('opacity', 1);
        });

        // Connecting lines from chain to error type cards
        var lineY1 = chainY + boxH + 20;
        var lineY2 = cardY - 5;
        errorTypes.forEach(function (et, ei) {
            var cx = 20 + ei * (cardW + cardGap) + cardW / 2;
            svg.append('line').attr('x1', cx).attr('y1', lineY1)
                .attr('x2', cx).attr('y2', lineY2)
                .attr('stroke', et.color).attr('stroke-width', 1)
                .attr('stroke-dasharray', '4,3').attr('opacity', 0.4);
        });
    }

    // ─── SHARED: TOOLTIP HELPER ────────────────────────────────
    function _createTooltip(parentContainer) {
        var tip = document.createElement('div');
        tip.className = 'viz-tooltip';
        tip.style.cssText = 'position:absolute;pointer-events:none;opacity:0;transition:opacity 0.15s;' +
            'background:rgba(15,23,42,0.95);color:#e2e8f0;padding:10px 14px;border-radius:10px;' +
            'font-size:13px;line-height:1.45;max-width:260px;box-shadow:0 8px 24px rgba(0,0,0,0.3);' +
            'border:1px solid rgba(71,85,105,0.4);backdrop-filter:blur(8px);z-index:30;' +
            'font-family:Inter,Helvetica Neue,Arial,sans-serif;';
        parentContainer.style.position = 'relative';
        parentContainer.appendChild(tip);
        return tip;
    }
    function _showTooltip(tip, html, x, y) {
        tip.innerHTML = html;
        tip.style.left = x + 'px';
        tip.style.top = y + 'px';
        tip.style.opacity = '1';
    }
    function _hideTooltip(tip) { tip.style.opacity = '0'; }

    // ─── ANIMATED PIPELINE (packets flowing through stations) ─
    function animatedPipeline(container, config) {
        var W = 1060, H = 340;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Glow filter
        var defs = svg.append('defs');
        var filter = defs.append('filter').attr('id', 'pkt-glow');
        filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
        var mg = filter.append('feMerge');
        mg.append('feMergeNode').attr('in', 'blur');
        mg.append('feMergeNode').attr('in', 'SourceGraphic');

        // Grid background
        var gridP = defs.append('pattern')
            .attr('id', 'pipe-grid').attr('width', 40).attr('height', 40)
            .attr('patternUnits', 'userSpaceOnUse');
        gridP.append('path').attr('d', 'M 40 0 L 0 0 0 40')
            .attr('fill', 'none').attr('stroke', '#1e293b').attr('stroke-width', 0.8);

        svg.append('rect').attr('width', W).attr('height', H).attr('fill', '#0f172a').attr('rx', 12);
        svg.append('rect').attr('width', W).attr('height', H).attr('fill', 'url(#pipe-grid)');

        var stations = (config && config.stations) || [
            { id: 'gap', label: 'Workflow Gap', sub: 'Identify problem', x: 80, y: 140, w: 110, h: 56, color: '#ef4444' },
            { id: 'spec', label: 'Functional Spec', sub: 'Define requirements', x: 260, y: 140, w: 130, h: 56, color: '#f97316' },
            { id: 'build', label: 'Build / Code', sub: 'Develop solution', x: 460, y: 140, w: 110, h: 56, color: '#22c55e' },
            { id: 'test', label: 'Validate', sub: 'Clinical testing', x: 640, y: 140, w: 100, h: 56, color: '#3b82f6' },
            { id: 'deploy', label: 'Deploy', sub: 'Ship to users', x: 810, y: 140, w: 90, h: 56, color: '#8b5cf6' },
            { id: 'feedback', label: 'Feedback', sub: 'Measure & iterate', x: 960, y: 140, w: 90, h: 56, color: '#06b6d4' }
        ];

        // Draw tracks
        for (var ti = 0; ti < stations.length - 1; ti++) {
            var s1 = stations[ti], s2 = stations[ti + 1];
            svg.append('path').attr('id', 'track-' + ti)
                .attr('d', 'M' + (s1.x + s1.w) + ',' + (s1.y + s1.h / 2) +
                    ' C' + (s1.x + s1.w + 40) + ',' + (s1.y + s1.h / 2) +
                    ' ' + (s2.x - 40) + ',' + (s2.y + s2.h / 2) +
                    ' ' + s2.x + ',' + (s2.y + s2.h / 2))
                .attr('fill', 'none').attr('stroke', '#334155')
                .attr('stroke-width', 4).attr('stroke-linecap', 'round');
        }

        // Feedback loop
        var fst = stations[0], lst = stations[stations.length - 1];
        svg.append('path')
            .attr('d', 'M' + (lst.x + lst.w / 2) + ',' + lst.y +
                ' C' + (lst.x + lst.w / 2) + ',50' +
                ' ' + (fst.x + fst.w / 2) + ',50' +
                ' ' + (fst.x + fst.w / 2) + ',' + fst.y)
            .attr('fill', 'none').attr('stroke', '#f59e0b')
            .attr('stroke-width', 2).attr('stroke-dasharray', '8,5').attr('opacity', 0.5);

        svg.append('text').attr('x', W / 2).attr('y', 40)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#f59e0b').attr('font-weight', '600')
            .text('Feedback Loop \u2014 iterate based on real usage');

        // Draw stations
        stations.forEach(function (st, i) {
            var g = svg.append('g').style('opacity', 0);
            g.append('rect').attr('x', st.x).attr('y', st.y)
                .attr('width', st.w).attr('height', st.h).attr('rx', 10)
                .attr('fill', '#1e293b').attr('stroke', st.color).attr('stroke-width', 2);
            g.append('text').attr('x', st.x + st.w / 2).attr('y', st.y + 26)
                .attr('text-anchor', 'middle').attr('font-size', '13px')
                .attr('font-weight', '700').attr('fill', '#f8fafc').text(st.label);
            g.append('text').attr('x', st.x + st.w / 2).attr('y', st.y + 44)
                .attr('text-anchor', 'middle').attr('font-size', '10px')
                .attr('fill', '#94a3b8').text(st.sub);
            g.append('circle').attr('cx', st.x - 10).attr('cy', st.y + st.h / 2)
                .attr('r', 5).attr('fill', st.color)
                .style('filter', 'drop-shadow(0 0 6px ' + st.color + ')');
            g.transition().delay(i * 200).duration(400).style('opacity', 1);
        });

        // Timeline annotation below
        var roles = [
            { text: 'Domain Expert (You)', x: 170, color: '#ef4444' },
            { text: 'Developer + Clinician', x: 530, color: '#22c55e' },
            { text: 'Production', x: 900, color: '#8b5cf6' }
        ];
        roles.forEach(function (r) {
            svg.append('text').attr('x', r.x).attr('y', H - 40)
                .attr('text-anchor', 'middle').attr('font-size', '11px')
                .attr('fill', r.color).attr('font-weight', '600').text(r.text);
        });

        // Spawn animated packets
        function spawnPacket() {
            var types = [
                { label: 'FS Alert', color: '#ef4444' },
                { label: 'NGS Rpt', color: '#22c55e' },
                { label: 'QA Tool', color: '#3b82f6' },
                { label: 'Dash', color: '#f59e0b' }
            ];
            var pt = types[Math.floor(Math.random() * types.length)];
            var pkt = svg.append('g').attr('filter', 'url(#pkt-glow)');
            pkt.append('rect').attr('x', -18).attr('y', -9)
                .attr('width', 36).attr('height', 18).attr('rx', 4).attr('fill', pt.color);
            pkt.append('text').attr('y', 1).attr('text-anchor', 'middle')
                .attr('font-size', '7px').attr('font-weight', '700')
                .attr('fill', '#fff').attr('dominant-baseline', 'middle').text(pt.label);

            var idx = 0;
            function step() {
                var path = svg.select('#track-' + idx).node();
                if (!path) { pkt.transition().duration(300).style('opacity', 0).remove(); return; }
                var len = path.getTotalLength();
                var p0 = path.getPointAtLength(0);
                pkt.attr('transform', 'translate(' + p0.x + ',' + p0.y + ')');
                pkt.transition().duration(1100 + Math.random() * 400).ease(d3.easeLinear)
                    .attrTween('transform', function () {
                        return function (t) {
                            var p = path.getPointAtLength(t * len);
                            return 'translate(' + p.x + ',' + p.y + ')';
                        };
                    })
                    .on('end', function () {
                        idx++;
                        if (idx < stations.length - 1) setTimeout(step, 150 + Math.random() * 250);
                        else pkt.transition().duration(400).style('opacity', 0).remove();
                    });
            }
            step();
        }

        var sc = 0;
        function sched() {
            if (sc++ >= 12) return;
            spawnPacket();
            setTimeout(sched, 2200 + Math.random() * 1400);
        }
        setTimeout(sched, 1200);
    }

    // ─── SEVEN OPTIONS LADDER ─────────────────────────────────
    function sevenOptionsLadder(container, config) {
        var W = 1060, H = 380;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var tip = _createTooltip(container);

        var options = [
            { label: '1. Ignore the gap', sub: 'Live with it — accept the friction', color: '#8b0000', bg: '#fce4e4', icon: '🙈', zone: 'passive', tip: '<strong>Risk:</strong> Friction compounds. Every workaround is a future error. Staff burnout increases, and the gap never closes.' },
            { label: '2. Patch manually', sub: 'Workarounds, spreadsheets, sticky notes', color: '#a0522d', bg: '#faebd7', icon: '🩹', zone: 'passive', tip: '<strong>Reality:</strong> 80% of labs do this. Spreadsheets become critical infrastructure that no one maintains. One person leaves, the workaround dies.' },
            { label: '3. Switch LIS vendor', sub: 'Nuclear option — massive cost, 2-3 year project', color: '#6b4c3b', bg: '#f5ebe0', icon: '💣', zone: 'passive', tip: '<strong>Cost:</strong> $5–15M+ for a large lab. 2–3 year implementation. And the new LIS will have its own gaps.' },
            { label: '4. Request vendor fix', sub: 'Submit ticket, wait 12-18 months, hope', color: '#b8860b', bg: '#fef9e7', icon: '📋', zone: 'dependent', tip: '<strong>Challenge:</strong> Your request competes with hundreds of others. Even if approved, the vendor\u2019s generic solution may not match your specific workflow.' },
            { label: '5. Outsource development', sub: 'Hire contractors — works if spec is clear', color: '#d35400', bg: '#fdf2e9', icon: '🤝', zone: 'active', tip: '<strong>Key:</strong> Requires a clear functional specification. Without domain expertise on the contractor side, expect multiple revision cycles.' },
            { label: '6. Build it yourself', sub: 'In-house team with domain expertise', color: '#1e8449', bg: '#eafaf1', icon: '🔧', zone: 'active', tip: '<strong>Advantage:</strong> Fastest iteration, deepest domain fit. Gershkovich & Sinard showed cost-effectiveness over 4–5 years. Yale has done this for 15+ years.' },
            { label: '7. Integrate open-source', sub: 'QuPath, DSA, Slideflow — customize & deploy', color: '#1a5276', bg: '#e8f0f8', icon: '🧩', zone: 'active', tip: '<strong>Best of both:</strong> Start from production-quality code, customize for your needs. Growing ecosystem with community support.' }
        ];

        var stepH = 44, baseW = 900, narrowing = 55;

        // Zone bracket on left
        svg.append('line').attr('x1', 25).attr('x2', 25)
            .attr('y1', 14).attr('y2', H - 10)
            .attr('stroke', '#ccc').attr('stroke-width', 2.5);

        // Passive zone label
        svg.append('text').attr('x', 16).attr('y', 90)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('font-weight', '700').attr('fill', '#8b0000')
            .attr('transform', 'rotate(-90, 16, 90)')
            .text('PASSIVE');

        // Active zone label
        svg.append('text').attr('x', 16).attr('y', H - 50)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('font-weight', '700').attr('fill', '#1e8449')
            .attr('transform', 'rotate(-90, 16, ' + (H - 50) + ')')
            .text('ACTIVE');

        options.forEach(function (opt, i) {
            var w = baseW - (options.length - 1 - i) * narrowing;
            var x = 40 + (baseW - w) / 2;
            var y = 12 + i * (stepH + 4);

            var g = svg.append('g').style('opacity', 0);

            var rect = g.append('rect').attr('x', x).attr('y', y)
                .attr('width', w).attr('height', stepH)
                .attr('rx', 8).attr('fill', opt.bg)
                .attr('stroke', opt.color).attr('stroke-width', 2.5)
                .style('cursor', 'pointer')
                .style('transition', 'all 0.18s ease');

            g.append('text').attr('x', x + 40).attr('y', y + 20)
                .attr('font-size', '14px').attr('font-weight', '700')
                .attr('fill', opt.color).text(opt.label)
                .style('pointer-events', 'none');

            g.append('text').attr('x', x + 40).attr('y', y + 36)
                .attr('font-size', '11.5px').attr('fill', '#333').text(opt.sub)
                .style('pointer-events', 'none');

            g.append('text').attr('x', x + 14).attr('y', y + 30)
                .attr('font-size', '18px').text(opt.icon)
                .style('pointer-events', 'none');

            // Hover tooltip + highlight
            if (opt.tip) {
                (function (optRef, rectRef, xPos, yPos, width) {
                    rectRef.on('mouseenter', function () {
                        rectRef.attr('stroke-width', 4);
                        d3.select(this.parentNode).style('filter', 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))');
                        _showTooltip(tip, optRef.tip, xPos + width + 16, yPos - 8);
                    }).on('mouseleave', function () {
                        rectRef.attr('stroke-width', 2.5);
                        d3.select(this.parentNode).style('filter', 'none');
                        _hideTooltip(tip);
                    });
                })(opt, rect, x, y, w);
            }

            g.transition().delay(i * 200).duration(400).style('opacity', 1);
        });

        // Arrow on right side
        svg.append('text').attr('x', W - 26).attr('y', H / 2 + 5)
            .attr('text-anchor', 'middle').attr('font-size', '32px')
            .attr('fill', '#1e8449').text('▲')
            .style('opacity', 0)
            .transition().delay(1600).duration(500).style('opacity', 0.8);

        svg.append('text').attr('x', W - 26).attr('y', H / 2 + 25)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#1e8449').attr('font-weight', '700')
            .text('IMPACT')
            .style('opacity', 0)
            .transition().delay(1600).duration(500).style('opacity', 0.8);
    }

    // ─── COST COMPARISON (vendor vs custom over time) ────────
    function costComparison(container, config) {
        var W = 1060, H = 340;
        var margin = { top: 36, right: 120, bottom: 44, left: 80 };
        var chartW = W - margin.left - margin.right;
        var chartH = H - margin.top - margin.bottom;

        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var vendorInit = (config && config.vendorInitial) || 200;
        var vendorPct = (config && config.vendorAnnualPct) || 0.23;
        var customInit = (config && config.customInitial) || 350;
        var customPct = (config && config.customAnnualPct) || 0.05;
        var years = (config && config.years) || 10;

        // Generate data
        var vendorData = [], customData = [];
        var vendorCum = vendorInit, customCum = customInit;
        vendorData.push({ year: 0, cost: vendorInit });
        customData.push({ year: 0, cost: customInit });

        for (var yr = 1; yr <= years; yr++) {
            vendorCum += vendorInit * vendorPct;
            customCum += customInit * customPct;
            vendorData.push({ year: yr, cost: vendorCum });
            customData.push({ year: yr, cost: customCum });
        }

        var maxCost = Math.max(vendorData[years].cost, customData[years].cost);

        var xScale = d3.scaleLinear().domain([0, years]).range([0, chartW]);
        var yScale = d3.scaleLinear().domain([0, maxCost * 1.1]).range([chartH, 0]);

        // Axes
        var xAxis = d3.axisBottom(xScale).ticks(years).tickFormat(function (d) { return 'Yr ' + d; });
        var yAxis = d3.axisLeft(yScale).ticks(6).tickFormat(function (d) { return '$' + d + 'K'; });

        g.append('g').attr('transform', 'translate(0,' + chartH + ')')
            .call(xAxis)
            .selectAll('text').attr('font-size', '12px').attr('fill', '#333').attr('font-weight', '500');

        g.append('g').call(yAxis)
            .selectAll('text').attr('font-size', '12px').attr('fill', '#333').attr('font-weight', '500');

        // Grid lines
        g.selectAll('.grid-line')
            .data(yScale.ticks(6)).enter()
            .append('line')
            .attr('x1', 0).attr('x2', chartW)
            .attr('y1', function (d) { return yScale(d); })
            .attr('y2', function (d) { return yScale(d); })
            .attr('stroke', '#ccc').attr('stroke-width', 1);

        // Vendor line
        var vendorLine = d3.line()
            .x(function (d) { return xScale(d.year); })
            .y(function (d) { return yScale(d.cost); });

        var customLine = d3.line()
            .x(function (d) { return xScale(d.year); })
            .y(function (d) { return yScale(d.cost); });

        // Find crossover point
        var crossYear = -1;
        for (var ci = 1; ci <= years; ci++) {
            if (vendorData[ci].cost >= customData[ci].cost && vendorData[ci - 1].cost < customData[ci - 1].cost) {
                crossYear = ci;
                break;
            }
        }
        // If vendor starts lower
        if (vendorData[0].cost < customData[0].cost) {
            for (var ci2 = 1; ci2 <= years; ci2++) {
                if (vendorData[ci2].cost >= customData[ci2].cost) {
                    crossYear = ci2;
                    break;
                }
            }
        }

        // Breakeven annotation
        if (crossYear > 0) {
            var bx = xScale(crossYear);
            var by = yScale(vendorData[crossYear].cost);
            g.append('line').attr('x1', bx).attr('x2', bx)
                .attr('y1', 0).attr('y2', chartH)
                .attr('stroke', '#e74c3c').attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '6,4').attr('opacity', 0.6);

            g.append('text').attr('x', bx + 8).attr('y', 16)
                .attr('font-size', '11px').attr('fill', '#e74c3c')
                .attr('font-weight', '700')
                .text('Breakeven ~Year ' + crossYear);
        }

        // Shade the savings area after breakeven
        if (crossYear > 0) {
            var areaData = [];
            for (var ai = crossYear; ai <= years; ai++) {
                areaData.push({
                    year: ai,
                    vendorCost: vendorData[ai].cost,
                    customCost: customData[ai].cost
                });
            }
            var area = d3.area()
                .x(function (d) { return xScale(d.year); })
                .y0(function (d) { return yScale(d.customCost); })
                .y1(function (d) { return yScale(d.vendorCost); });

            g.append('path').datum(areaData)
                .attr('d', area)
                .attr('fill', '#27ae60').attr('fill-opacity', 0.2)
                .style('opacity', 0)
                .transition().delay(2000).duration(600).style('opacity', 1);

            // Savings label
            var savingsYear = years;
            var savings = vendorData[savingsYear].cost - customData[savingsYear].cost;
            g.append('text')
                .attr('x', xScale((crossYear + years) / 2))
                .attr('y', yScale((vendorData[savingsYear].cost + customData[savingsYear].cost) / 2) + 5)
                .attr('text-anchor', 'middle').attr('font-size', '12px')
                .attr('fill', '#27ae60').attr('font-weight', '700')
                .text('$' + Math.round(savings) + 'K saved')
                .style('opacity', 0)
                .transition().delay(2400).duration(500).style('opacity', 1);
        }

        // Draw vendor line with animation
        var vendorPath = g.append('path').datum(vendorData)
            .attr('d', vendorLine)
            .attr('fill', 'none').attr('stroke', '#e74c3c')
            .attr('stroke-width', 3);
        var vendorLen = vendorPath.node().getTotalLength();
        vendorPath.attr('stroke-dasharray', vendorLen)
            .attr('stroke-dashoffset', vendorLen)
            .transition().duration(1500).attr('stroke-dashoffset', 0);

        // Draw custom line with animation
        var customPath = g.append('path').datum(customData)
            .attr('d', customLine)
            .attr('fill', 'none').attr('stroke', '#27ae60')
            .attr('stroke-width', 3);
        var customLen = customPath.node().getTotalLength();
        customPath.attr('stroke-dasharray', customLen)
            .attr('stroke-dashoffset', customLen)
            .transition().duration(1500).attr('stroke-dashoffset', 0);

        // Interactive data point dots with hover
        var costTip = _createTooltip(container);

        vendorData.forEach(function (d) {
            g.append('circle')
                .attr('cx', xScale(d.year)).attr('cy', yScale(d.cost))
                .attr('r', 5).attr('fill', '#e74c3c').attr('stroke', '#fff').attr('stroke-width', 1.5)
                .style('cursor', 'pointer').style('opacity', 0)
                .transition().delay(1500 + d.year * 100).duration(300).style('opacity', 1);
        });
        customData.forEach(function (d) {
            g.append('circle')
                .attr('cx', xScale(d.year)).attr('cy', yScale(d.cost))
                .attr('r', 5).attr('fill', '#27ae60').attr('stroke', '#fff').attr('stroke-width', 1.5)
                .style('cursor', 'pointer').style('opacity', 0)
                .transition().delay(1500 + d.year * 100).duration(300).style('opacity', 1);
        });

        // Overlay transparent rect for mouse tracking
        g.append('rect').attr('width', chartW).attr('height', chartH)
            .attr('fill', 'transparent').style('cursor', 'crosshair')
            .on('mousemove', function (event) {
                var coords = d3.pointer(event);
                var yr = Math.round(xScale.invert(coords[0]));
                if (yr >= 0 && yr <= years) {
                    var vCost = vendorData[yr].cost;
                    var cCost = customData[yr].cost;
                    var diff = vCost - cCost;
                    var diffLabel = diff >= 0
                        ? '<span style="color:#27ae60">Custom saves $' + Math.round(Math.abs(diff)) + 'K</span>'
                        : '<span style="color:#e74c3c">Custom costs $' + Math.round(Math.abs(diff)) + 'K more</span>';
                    _showTooltip(costTip,
                        '<strong>Year ' + yr + '</strong><br>' +
                        '<span style="color:#e74c3c">Vendor: $' + Math.round(vCost) + 'K</span><br>' +
                        '<span style="color:#27ae60">Custom: $' + Math.round(cCost) + 'K</span><br>' +
                        diffLabel,
                        coords[0] + margin.left + 14, coords[1] + margin.top - 20);
                }
            })
            .on('mouseleave', function () { _hideTooltip(costTip); });

        // Legend
        var legend = svg.append('g')
            .attr('transform', 'translate(' + (W - 110) + ',' + (margin.top + 20) + ')');

        legend.append('line').attr('x1', 0).attr('x2', 24).attr('y1', 0).attr('y2', 0)
            .attr('stroke', '#e74c3c').attr('stroke-width', 3);
        legend.append('text').attr('x', 30).attr('y', 4)
            .attr('font-size', '12px').attr('fill', '#e74c3c').text('Vendor');

        legend.append('line').attr('x1', 0).attr('x2', 24).attr('y1', 22).attr('y2', 22)
            .attr('stroke', '#27ae60').attr('stroke-width', 3);
        legend.append('text').attr('x', 30).attr('y', 26)
            .attr('font-size', '12px').attr('fill', '#27ae60').text('Custom');

        // Axis labels
        svg.append('text')
            .attr('x', margin.left + chartW / 2).attr('y', H - 6)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#333').attr('font-weight', '600').text('Years after initial investment');

        svg.append('text')
            .attr('x', 16).attr('y', margin.top + chartH / 2)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#333').attr('font-weight', '600')
            .attr('transform', 'rotate(-90, 16, ' + (margin.top + chartH / 2) + ')')
            .text('Cumulative Cost ($K)');
    }

    // ─── TECH STACK PYRAMID ──────────────────────────────────
    function techStackPyramid(container, config) {
        var W = 1060, H = 380;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var tip = _createTooltip(container);

        var layers = [
            { label: 'Clinical Requirements & Specifications', sub: 'What does the tool need to do? (YOU write this)', color: '#c0392b', bg: '#fdecea', role: '← Pathologist-driven', icon: '🩺', tip: '<strong>Your most impactful contribution.</strong> Define what the tool must do, who uses it, and what "correct" looks like. No code required.' },
            { label: 'User Interface (UI)', sub: 'HTML, CSS, React — what users see and interact with', color: '#d35400', bg: '#fdf2e9', role: '← Design + clinical input', icon: '🖥️', tip: '<strong>Where usability lives.</strong> Pathologists shape the interface — button placement, workflow order, what information appears where.' },
            { label: 'Application Logic', sub: 'Python, JavaScript, Java — business rules, algorithms', color: '#b7950b', bg: '#fef9e7', role: '← Developer + domain expert', icon: '⚙️', tip: '<strong>The engine.</strong> Business rules translated to code. Domain expert reviews ensure the logic matches clinical reality.' },
            { label: 'APIs & Integration', sub: 'REST, HL7 FHIR, DICOM — connecting systems', color: '#1e8449', bg: '#eafaf1', role: '← Developer', icon: '🔗', tip: '<strong>System glue.</strong> Connects your tool to the LIS, image servers, and external databases.' },
            { label: 'Data & Storage', sub: 'PostgreSQL, MongoDB — where data lives', color: '#1a5276', bg: '#e8f0f8', role: '← Developer + DBA', icon: '🗄️', tip: '<strong>Foundation.</strong> How data is structured, stored, and retrieved. Gets the schema right or nothing else works.' },
            { label: 'Infrastructure', sub: 'Servers, Docker, Cloud, Networks — the plumbing', color: '#6c3483', bg: '#f4ecf7', role: '← IT / DevOps', icon: '🏗️', tip: '<strong>The plumbing.</strong> Servers, containers, networking. Usually handled by IT, not pathologists.' }
        ];

        var stepH = 50, baseW = 920, narrowing = 70;

        // "You are here" bracket around top 2 layers
        var bracketTop = 6;
        var bracketH = 2 * stepH + 18;
        svg.append('rect').attr('x', 28).attr('y', bracketTop)
            .attr('width', W - 56).attr('height', bracketH)
            .attr('rx', 12).attr('fill', 'rgba(192,57,43,0.06)')
            .attr('stroke', '#c0392b').attr('stroke-dasharray', '6,4')
            .attr('stroke-width', 2.5);

        svg.append('text').attr('x', W - 46).attr('y', bracketTop + bracketH / 2 + 5)
            .attr('text-anchor', 'end').attr('font-size', '13px')
            .attr('fill', '#c0392b').attr('font-weight', '700')
            .text('▲ YOUR HIGHEST IMPACT ZONE');

        layers.forEach(function (layer, i) {
            var w = baseW - i * narrowing;
            var x = (W - w) / 2;
            var y = 14 + i * (stepH + 5);

            var g = svg.append('g').style('opacity', 0);

            var rect = g.append('rect').attr('x', x).attr('y', y)
                .attr('width', w).attr('height', stepH)
                .attr('rx', 8).attr('fill', layer.bg)
                .attr('stroke', layer.color).attr('stroke-width', 2.5)
                .style('cursor', 'pointer')
                .style('transition', 'all 0.18s ease');

            g.append('text').attr('x', x + 42).attr('y', y + 22)
                .attr('font-size', '15px').attr('font-weight', '700')
                .attr('fill', layer.color).text(layer.label)
                .style('pointer-events', 'none');

            g.append('text').attr('x', x + 42).attr('y', y + 40)
                .attr('font-size', '12px').attr('fill', '#333').text(layer.sub)
                .style('pointer-events', 'none');

            g.append('text').attr('x', x + 14).attr('y', y + 32)
                .attr('font-size', '18px').text(layer.icon)
                .style('pointer-events', 'none');

            // Role annotation on right
            g.append('text').attr('x', x + w + 14).attr('y', y + 32)
                .attr('font-size', '12px').attr('fill', layer.color)
                .attr('font-weight', '700').text(layer.role)
                .style('pointer-events', 'none');

            // Hover tooltip + highlight
            (function (layerRef, rectRef, xPos, yPos, width) {
                rectRef.on('mouseenter', function () {
                    rectRef.attr('stroke-width', 4);
                    d3.select(this.parentNode).style('filter', 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))');
                    _showTooltip(tip, layerRef.tip, xPos + width / 2, yPos - 12);
                }).on('mouseleave', function () {
                    rectRef.attr('stroke-width', 2.5);
                    d3.select(this.parentNode).style('filter', 'none');
                    _hideTooltip(tip);
                });
            })(layer, rect, x, y, w);

            // All layers fully visible — no fading lower layers
            g.transition().delay(i * 250).duration(450).style('opacity', 1);
        });
    }

    // ─── DEV LIFECYCLE LOOP ──────────────────────────────────
    function devLifecycleLoop(container, config) {
        var W = 1060, H = 400;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var cx = W / 2, cy = H / 2 + 10, radius = 150;

        var steps = [
            { label: 'Identify Gap', sub: 'Observe workflow friction', color: '#c0392b', bg: '#fdecea', icon: '🔍' },
            { label: 'Specify', sub: 'Write functional spec', color: '#d35400', bg: '#fdf2e9', icon: '📋' },
            { label: 'Design', sub: 'Architecture & UX', color: '#b7950b', bg: '#fef9e7', icon: '✏️' },
            { label: 'Build', sub: 'Code & integrate', color: '#1e8449', bg: '#eafaf1', icon: '🔧' },
            { label: 'Test', sub: 'Validate clinically', color: '#1a5276', bg: '#e8f0f8', icon: '🧪' },
            { label: 'Deploy', sub: 'Ship to production', color: '#6c3483', bg: '#f4ecf7', icon: '🚀' },
            { label: 'Feedback', sub: 'Measure & iterate', color: '#0e6e5c', bg: '#e8f8f5', icon: '📊' }
        ];

        var n = steps.length;

        // Center label
        svg.append('text').attr('x', cx).attr('y', cy - 12)
            .attr('text-anchor', 'middle').attr('font-size', '18px')
            .attr('font-weight', '700').attr('fill', '#1a2e44')
            .text('Iterative');
        svg.append('text').attr('x', cx).attr('y', cy + 10)
            .attr('text-anchor', 'middle').attr('font-size', '18px')
            .attr('font-weight', '700').attr('fill', '#1a2e44')
            .text('Development');
        svg.append('text').attr('x', cx).attr('y', cy + 32)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#555').attr('font-weight', '600')
            .text('(not waterfall)');

        // Draw connecting arcs — bolder arrows
        steps.forEach(function (step, i) {
            var angle = (i / n) * 2 * Math.PI - Math.PI / 2;
            var nextAngle = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;

            var midAngle = (angle + nextAngle) / 2;
            var arrowR = radius - 2;
            var ax = cx + arrowR * Math.cos(midAngle);
            var ay = cy + arrowR * Math.sin(midAngle);

            svg.append('text').attr('x', ax).attr('y', ay + 4)
                .attr('text-anchor', 'middle').attr('font-size', '18px')
                .attr('fill', '#888')
                .attr('transform', 'rotate(' + (midAngle * 180 / Math.PI + 90) + ',' + ax + ',' + ay + ')')
                .text('▸')
                .style('opacity', 0)
                .transition().delay(n * 200 + i * 100).duration(300).style('opacity', 0.7);
        });

        // Draw nodes
        steps.forEach(function (step, i) {
            var angle = (i / n) * 2 * Math.PI - Math.PI / 2;
            var nx = cx + radius * Math.cos(angle);
            var ny = cy + radius * Math.sin(angle);

            var nodeG = svg.append('g')
                .attr('transform', 'translate(' + nx + ',' + ny + ')')
                .style('opacity', 0);

            nodeG.append('circle').attr('r', 44)
                .attr('fill', step.bg)
                .attr('stroke', step.color).attr('stroke-width', 3);

            nodeG.append('text').attr('y', -10)
                .attr('text-anchor', 'middle').attr('font-size', '20px')
                .text(step.icon);

            nodeG.append('text').attr('y', 10)
                .attr('text-anchor', 'middle').attr('font-size', '12px')
                .attr('font-weight', '700').attr('fill', step.color)
                .text(step.label);

            nodeG.append('text').attr('y', 24)
                .attr('text-anchor', 'middle').attr('font-size', '9px')
                .attr('fill', '#333').attr('font-weight', '500').text(step.sub);

            nodeG.transition().delay(i * 200).duration(400).style('opacity', 1);
        });

        // "Security & Compliance" ring — bolder
        svg.append('circle').attr('cx', cx).attr('cy', cy).attr('r', radius + 52)
            .attr('fill', 'none').attr('stroke', '#c0392b')
            .attr('stroke-width', 2.5).attr('stroke-dasharray', '8,6')
            .attr('opacity', 0.5);

        svg.append('text').attr('x', cx).attr('y', cy - radius - 60)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#c0392b').attr('font-weight', '700')
            .text('🛡️  SECURITY & COMPLIANCE BAKED INTO EVERY STEP');
    }

    // ─── REALM OPERATIONS DIAGRAM ─────────────────────────────
    // Translates the Svelte REALM diagram into a D3 interactive visualization
    // Shows the continuum of care with systems spanning workflow stages
    function realmDiagram(container, config) {
        var W = 1100, H = 620;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%')
            .style('font-family', "'Inter', 'Helvetica Neue', sans-serif");

        // Background
        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', '#0f172a').attr('rx', 12);

        var stages = [
            { label: 'Person', icon: '👤' }, { label: 'Specimen', icon: '🧫' },
            { label: 'Accession', icon: '📋' }, { label: 'Grossing', icon: '🔬' },
            { label: 'Histology', icon: '🔍' }, { label: 'Molecular', icon: '🧬' },
            { label: 'Evaluation', icon: '📊' }, { label: 'Path. Dx', icon: '🩺' },
            { label: 'Reporting', icon: '📄' }, { label: 'Research', icon: '🎓' }
        ];

        var statusColors = {
            active:   { bg: 'rgba(34,197,94,0.16)',  border: '#22C55E' },
            evolving: { bg: 'rgba(245,158,11,0.16)', border: '#F59E0B' },
            retiring: { bg: 'rgba(239,68,68,0.16)',  border: '#f87171' },
            retired:  { bg: 'rgba(100,116,139,0.12)', border: '#64748B' }
        };

        var domainColors = {
            orchestration: { bg: 'rgba(139,92,246,0.28)', border: '#8B5CF6' },
            diagnostics:   { bg: 'rgba(244,114,182,0.28)', border: '#F472B6' },
            analytics:     { bg: 'rgba(129,140,248,0.28)', border: '#818CF8' },
            asset:         { bg: 'rgba(96,165,250,0.28)',  border: '#60A5FA' },
            research:      { bg: 'rgba(45,212,191,0.28)',  border: '#2DD4BF' }
        };

        var systems = [
            { label: 'Digital Path / AI Tools', startCol: 0, endCol: 9, row: 0, status: 'active', domain: 'diagnostics',
              desc: 'External AI and digital pathology technologies' },
            { label: 'DSA-WSI-DeID', startCol: 9, endCol: 10, row: 0, status: 'active', domain: 'research',
              desc: 'Digital Slide Archive & De-identification' },
            { label: 'FSLink', startCol: 0, endCol: 4, row: 1, status: 'evolving', domain: 'diagnostics',
              desc: 'Frozen Section Link — real-time intraoperative consultation' },
            { label: 'Histology Asset Tracking', startCol: 4, endCol: 7, row: 1, status: 'retiring', domain: 'asset',
              desc: 'Parts, blocks, slides, IHC tracking' },
            { label: 'Downstream', startCol: 7, endCol: 10, row: 1, status: 'retiring', domain: 'diagnostics',
              desc: 'Tumor DNA sequencing workflow' },
            { label: 'Pathology Portal', startCol: 2, endCol: 10, row: 2, status: 'active', domain: 'diagnostics',
              desc: 'Unified pathology-centric patient care view' },
            { label: 'Elasticsearch', startCol: 0, endCol: 10, row: 3, status: 'active', domain: 'analytics',
              desc: 'Advanced indexing & analytics across entire continuum' },
            { label: 'Hermes', startCol: 0, endCol: 10, row: 4, status: 'active', domain: 'orchestration',
              desc: 'Data exchange engine — HL7, FHIR, ASTM, custom protocols' },
            { label: 'RTSE', startCol: 0, endCol: 10, row: 5, status: 'active', domain: 'orchestration',
              desc: 'Repetitive Task Scheduling Engine — work orchestration' },
            { label: 'Footprints', startCol: 0, endCol: 4, row: 6, status: 'retiring', domain: 'asset',
              desc: 'Inter-laboratory specimen traffic monitoring' },
            { label: 'Spotlight', startCol: 4, endCol: 7, row: 6, status: 'active', domain: 'analytics',
              desc: 'D3.js/Observable analytics engine' },
            { label: 'eHisto', startCol: 8, endCol: 10, row: 6, status: 'active', domain: 'research',
              desc: 'Central Tissue Resource Lab' },
            { label: 'CoPath Plus → Beaker', startCol: 0, endCol: 10, row: 7, status: 'retiring', domain: 'asset',
              desc: 'LIS — being replaced by Epic Beaker' },
            { label: 'Dialogue — AI Engine', startCol: 0, endCol: 10, row: 8, status: 'active', domain: 'orchestration',
              desc: 'Generative AI for sophisticated clinical tasks' }
        ];

        // Layout constants
        var marginLeft = 30, marginTop = 60, stageBarH = 50;
        var gridLeft = marginLeft, gridTop = marginTop + stageBarH + 15;
        var gridW = W - marginLeft * 2, gridH = H - gridTop - 90;
        var colW = gridW / 10;
        var rowH = gridH / 9;

        // Continuum of Care bar
        var stageG = svg.append('g').attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');
        stageG.append('rect').attr('width', gridW).attr('height', stageBarH)
            .attr('rx', 8).attr('fill', '#1e293b').attr('stroke', '#334155').attr('stroke-width', 1);

        stages.forEach(function(st, i) {
            var cx = i * colW + colW / 2;
            var g = stageG.append('g').attr('transform', 'translate(' + cx + ', 0)')
                .style('cursor', 'pointer').style('opacity', 0);

            g.append('rect').attr('x', -colW/2 + 2).attr('y', 2).attr('width', colW - 4).attr('height', stageBarH - 4)
                .attr('rx', 6).attr('fill', '#334155').attr('fill-opacity', 0.6);
            g.append('text').attr('y', 22).attr('text-anchor', 'middle')
                .attr('font-size', '16px').text(st.icon);
            g.append('text').attr('y', 40).attr('text-anchor', 'middle')
                .attr('font-size', '9px').attr('fill', '#94a3b8').attr('font-weight', 500)
                .text(st.label);

            g.on('mouseover', function() {
                // Highlight column
                svg.selectAll('.grid-col-' + i).attr('fill-opacity', 0.08);
                // Dim non-matching systems
                svg.selectAll('.sys-bar').each(function() {
                    var sCol = +d3.select(this).attr('data-start');
                    var eCol = +d3.select(this).attr('data-end');
                    if (i < sCol || i >= eCol) {
                        d3.select(this).transition().duration(150).style('opacity', 0.15);
                    } else {
                        d3.select(this).transition().duration(150).style('opacity', 1)
                            .attr('transform', 'scale(1, 1.08)');
                    }
                });
            }).on('mouseout', function() {
                svg.selectAll('.grid-col-' + i).attr('fill-opacity', 0);
                svg.selectAll('.sys-bar').transition().duration(200)
                    .style('opacity', 1).attr('transform', 'scale(1, 1)');
            });

            // Staggered entry
            g.transition().delay(100 + i * 60).duration(400).style('opacity', 1);
        });

        // Systems area background
        var sysG = svg.append('g').attr('transform', 'translate(' + gridLeft + ',' + gridTop + ')');
        sysG.append('rect').attr('width', gridW).attr('height', gridH)
            .attr('rx', 10).attr('fill', '#1e293b').attr('stroke', '#334155').attr('stroke-width', 1);

        // Grid column indicators (for hover)
        for (var ci = 0; ci < 10; ci++) {
            sysG.append('rect').attr('class', 'grid-col-' + ci)
                .attr('x', ci * colW).attr('y', 0).attr('width', colW).attr('height', gridH)
                .attr('fill', '#3b82f6').attr('fill-opacity', 0);
            // Subtle column dividers
            if (ci > 0) {
                sysG.append('line').attr('x1', ci * colW).attr('y1', 4)
                    .attr('x2', ci * colW).attr('y2', gridH - 4)
                    .attr('stroke', '#334155').attr('stroke-width', 0.5).attr('stroke-dasharray', '2,4')
                    .attr('opacity', 0.4);
            }
        }

        // Tooltip
        var tooltip = d3.select(container).append('div')
            .style('position', 'absolute').style('bottom', '10px').style('left', '50%')
            .style('transform', 'translateX(-50%)').style('background', '#1e293b')
            .style('border', '1px solid #475569').style('border-radius', '10px')
            .style('padding', '10px 16px').style('color', '#f8fafc')
            .style('font-size', '13px').style('font-family', "'Inter', sans-serif")
            .style('pointer-events', 'none').style('opacity', 0).style('transition', 'opacity 0.2s')
            .style('max-width', '500px').style('text-align', 'center')
            .style('box-shadow', '0 8px 24px rgba(0,0,0,0.5)').style('z-index', 50);

        // Render system bars
        systems.forEach(function(sys, si) {
            var x = sys.startCol * colW + 3;
            var w = (sys.endCol - sys.startCol) * colW - 6;
            var y = sys.row * rowH + 4;
            var h = rowH - 8;
            var dc = domainColors[sys.domain] || { bg: 'rgba(100,116,139,0.2)', border: '#64748B' };
            var sc = statusColors[sys.status] || statusColors.active;

            var g = sysG.append('g').attr('class', 'sys-bar')
                .attr('data-start', sys.startCol).attr('data-end', sys.endCol)
                .style('cursor', 'pointer').style('opacity', 0);

            g.append('rect').attr('x', x).attr('y', y).attr('width', w).attr('height', h)
                .attr('rx', 5).attr('fill', dc.bg)
                .attr('stroke', sc.border).attr('stroke-width', 1.5);

            g.append('text').attr('x', x + w / 2).attr('y', y + h / 2 + 1)
                .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
                .attr('font-size', w > 200 ? '11px' : '9px')
                .attr('font-weight', 600).attr('fill', '#f0f0f0')
                .attr('font-family', "'JetBrains Mono', 'Menlo', monospace")
                .text(sys.label);

            // Status indicator dot
            g.append('circle').attr('cx', x + 10).attr('cy', y + 10).attr('r', 3)
                .attr('fill', sc.border);

            g.on('mouseover', function() {
                d3.select(this).select('rect').transition().duration(150)
                    .attr('stroke-width', 2.5).attr('stroke', '#ffffff');
                tooltip.html('<strong style="font-family: JetBrains Mono, monospace;">' + sys.label +
                    '</strong><span style="display:inline-block;margin-left:8px;padding:2px 6px;border-radius:3px;font-size:11px;background:' +
                    sc.bg + ';border:1px solid ' + sc.border + ';">' + sys.status + '</span>' +
                    '<br><span style="color:#94a3b8;font-size:12px;">' + sys.desc + '</span>')
                    .style('opacity', 1);
            }).on('mouseout', function() {
                d3.select(this).select('rect').transition().duration(200)
                    .attr('stroke-width', 1.5).attr('stroke', sc.border);
                tooltip.style('opacity', 0);
            });

            // Staggered cascade entry
            g.transition().delay(400 + si * 80).duration(500)
                .ease(d3.easeCubicOut).style('opacity', 1);
        });

        // Legend
        var legY = H - 40;
        var legData = [
            { label: 'Active', color: '#22C55E' }, { label: 'Evolving', color: '#F59E0B' },
            { label: 'Retiring', color: '#f87171' }, { label: 'Retired', color: '#64748B' }
        ];
        var domLeg = [
            { label: 'Workflow', color: domainColors.orchestration.border },
            { label: 'Diagnostics', color: domainColors.diagnostics.border },
            { label: 'Analytics', color: domainColors.analytics.border },
            { label: 'Assets', color: domainColors.asset.border },
            { label: 'Research', color: domainColors.research.border }
        ];

        var legG = svg.append('g').attr('transform', 'translate(' + marginLeft + ',' + legY + ')').style('opacity', 0);

        // Status legend
        legG.append('text').attr('x', 0).attr('y', 10).attr('font-size', '9px')
            .attr('fill', '#cbd5e1').attr('font-weight', 500).attr('text-transform', 'uppercase')
            .attr('letter-spacing', '0.05em').text('STATUS');
        legData.forEach(function(d, i) {
            legG.append('circle').attr('cx', 60 + i * 80).attr('cy', 7).attr('r', 4).attr('fill', d.color);
            legG.append('text').attr('x', 68 + i * 80).attr('y', 10).attr('font-size', '9px')
                .attr('fill', '#94a3b8').text(d.label);
        });

        // Domain legend
        legG.append('text').attr('x', 420).attr('y', 10).attr('font-size', '9px')
            .attr('fill', '#cbd5e1').attr('font-weight', 500).text('ROLE');
        domLeg.forEach(function(d, i) {
            legG.append('rect').attr('x', 460 + i * 100).attr('y', 2).attr('width', 12).attr('height', 12)
                .attr('rx', 2).attr('fill', d.color).attr('fill-opacity', 0.3)
                .attr('stroke', d.color).attr('stroke-width', 1);
            legG.append('text').attr('x', 476 + i * 100).attr('y', 11).attr('font-size', '9px')
                .attr('fill', '#94a3b8').text(d.label);
        });

        legG.transition().delay(1200).duration(500).style('opacity', 1);
    }


    // ─── FEEDBACK LOOP COMPARISON (animated) ────────────────────
    // Shows Old Loop (hours) vs New Loop (minutes) as animated cycle diagrams
    function feedbackLoop(container, config) {
        var W = 1050, H = 420;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Two loop centers
        var loops = [
            { cx: 240, cy: 210, r: 140, label: 'Old Loop', time: 'Hours → Days',
              color: '#c0392b', bgColor: 'rgba(192,57,43,0.06)',
              steps: ['Write', 'Compile', 'Test', 'Debug', 'Revise'],
              speedLabel: 'COMMIT or ABANDON' },
            { cx: 810, cy: 210, r: 140, label: 'New Loop', time: 'Minutes',
              color: '#27ae60', bgColor: 'rgba(39,174,96,0.06)',
              steps: ['Describe', 'Evaluate', 'Adjust'],
              speedLabel: 'EXPLORE freely' }
        ];

        // Center divider with vs label
        svg.append('line').attr('x1', W/2).attr('y1', 30).attr('x2', W/2).attr('y2', H - 30)
            .attr('stroke', '#334155').attr('stroke-width', 1).attr('stroke-dasharray', '4,4');
        svg.append('text').attr('x', W/2).attr('y', H/2)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('fill', '#e2e8f0').attr('font-weight', 600).text('vs');

        loops.forEach(function(loop, li) {
            var g = svg.append('g').style('opacity', 0);
            var n = loop.steps.length;

            // Background circle
            g.append('circle').attr('cx', loop.cx).attr('cy', loop.cy).attr('r', loop.r)
                .attr('fill', loop.bgColor).attr('stroke', loop.color)
                .attr('stroke-width', 1).attr('stroke-opacity', 0.3);

            // Title above
            g.append('text').attr('x', loop.cx).attr('y', 30)
                .attr('text-anchor', 'middle').attr('font-size', '16px')
                .attr('font-weight', 700).attr('fill', loop.color).text(loop.label);
            g.append('text').attr('x', loop.cx).attr('y', 50)
                .attr('text-anchor', 'middle').attr('font-size', '12px')
                .attr('fill', '#94a3b8').text(loop.time);

            // Center text
            g.append('text').attr('x', loop.cx).attr('y', loop.cy - 8)
                .attr('text-anchor', 'middle').attr('font-size', '10px')
                .attr('fill', '#cbd5e1').attr('font-weight', 500).text(loop.speedLabel);

            // Step nodes arranged in circle
            loop.steps.forEach(function(step, i) {
                var angle = (i / n) * Math.PI * 2 - Math.PI / 2;
                var x = loop.cx + Math.cos(angle) * (loop.r - 20);
                var y = loop.cy + Math.sin(angle) * (loop.r - 20);

                // Node
                var node = g.append('g').style('opacity', 0);
                node.append('circle').attr('cx', x).attr('cy', y).attr('r', 22)
                    .attr('fill', '#1e293b').attr('stroke', loop.color)
                    .attr('stroke-width', 2);
                node.append('text').attr('x', x).attr('y', y + 1)
                    .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
                    .attr('font-size', '10px').attr('font-weight', 600)
                    .attr('fill', '#f0f0f0').text(step);

                node.transition().delay(400 + li * 500 + i * 120).duration(400)
                    .ease(d3.easeCubicOut).style('opacity', 1);

                // Arrow to next node
                var nextAngle = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
                var nx = loop.cx + Math.cos(nextAngle) * (loop.r - 20);
                var ny = loop.cy + Math.sin(nextAngle) * (loop.r - 20);

                // Midpoint arc
                var midAngle = ((i + 0.5) / n) * Math.PI * 2 - Math.PI / 2;
                var mx = loop.cx + Math.cos(midAngle) * (loop.r - 5);
                var my = loop.cy + Math.sin(midAngle) * (loop.r - 5);

                var arcPath = 'M ' + x + ' ' + y + ' Q ' + mx + ' ' + my + ' ' + nx + ' ' + ny;
                var arrow = g.append('path').attr('d', arcPath)
                    .attr('fill', 'none').attr('stroke', loop.color)
                    .attr('stroke-width', 1.5).attr('stroke-opacity', 0.5)
                    .attr('marker-end', 'url(#arrow-' + li + ')');

                arrow.style('opacity', 0).transition()
                    .delay(600 + li * 500 + i * 120).duration(300).style('opacity', 1);
            });

            // Animate orbiting dot
            var orbitDot = g.append('circle').attr('r', 5).attr('fill', loop.color)
                .attr('opacity', 0.8).attr('filter', 'url(#glow-fb)');

            function orbitAnimate() {
                var dur = li === 0 ? 6000 : 2000; // Old loop slower
                orbitDot.transition().duration(dur).ease(d3.easeLinear)
                    .attrTween('cx', function() {
                        return function(t) {
                            var a = t * Math.PI * 2 - Math.PI / 2;
                            return loop.cx + Math.cos(a) * (loop.r - 20);
                        };
                    })
                    .attrTween('cy', function() {
                        return function(t) {
                            var a = t * Math.PI * 2 - Math.PI / 2;
                            return loop.cy + Math.sin(a) * (loop.r - 20);
                        };
                    })
                    .on('end', orbitAnimate);
            }
            setTimeout(orbitAnimate, 1000 + li * 600);

            g.transition().delay(200 + li * 400).duration(500).style('opacity', 1);
        });

        // Arrow marker defs
        var defs = svg.append('defs');
        [0, 1].forEach(function(i) {
            var color = i === 0 ? '#c0392b' : '#27ae60';
            defs.append('marker').attr('id', 'arrow-' + i)
                .attr('viewBox', '0 0 10 10').attr('refX', 8).attr('refY', 5)
                .attr('markerWidth', 6).attr('markerHeight', 6).attr('orient', 'auto')
                .append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z').attr('fill', color).attr('opacity', 0.5);
        });
        // Glow filter
        var filt = defs.append('filter').attr('id', 'glow-fb');
        filt.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
        var merge = filt.append('feMerge');
        merge.append('feMergeNode').attr('in', 'blur');
        merge.append('feMergeNode').attr('in', 'SourceGraphic');

        // Bottom annotation
        svg.append('text').attr('x', W/2).attr('y', H - 10)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#cbd5e1').attr('font-style', 'italic')
            .text('Speed doesn\'t just change how fast you work. It changes how you think.');
    }


    // ─── COGNITIVE LOAD REDISTRIBUTION (proportional area) ──────
    function cognitiveLoad(container, config) {
        var W = 1050, H = 380;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Light background to establish context for the test
        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', '#ffffff').attr('opacity', 0);

        // Dark text colors for each segment — high contrast on light fills
        var darkText = {
            '#c0392b': '#7a1f1a', '#e67e22': '#8a4c15', '#f39c12': '#8a5a0c',
            '#27ae60': '#18693a', '#2980b9': '#1a5276', '#8e44ad': '#5b2d71'
        };

        var scenarios = [
            { label: 'Before AI', x: 80,
              segments: [
                { label: 'Syntax & Boilerplate', pct: 0.40, color: '#c0392b' },
                { label: 'API Lookup / Setup', pct: 0.20, color: '#e67e22' },
                { label: 'Debugging', pct: 0.15, color: '#f39c12' },
                { label: 'Architectural Judgment', pct: 0.15, color: '#27ae60' },
                { label: 'Domain Thinking', pct: 0.10, color: '#2980b9' }
              ]
            },
            { label: 'With AI (projected)', x: 570,
              segments: [
                { label: 'Syntax & Boilerplate', pct: 0.08, color: '#c0392b' },
                { label: 'API Lookup / Setup', pct: 0.05, color: '#e67e22' },
                { label: 'Evaluation & Review', pct: 0.22, color: '#8e44ad' },
                { label: 'Architectural Judgment', pct: 0.35, color: '#27ae60' },
                { label: 'Domain Thinking', pct: 0.30, color: '#2980b9' }
              ]
            }
        ];

        var barW = 380, barH = 30, startY = 80;

        // Arrow between scenarios
        svg.append('line').attr('x1', 480).attr('y1', H/2).attr('x2', 545).attr('y2', H/2)
            .attr('stroke', '#64748b').attr('stroke-width', 2).attr('marker-end', 'url(#arr-cl)');
        svg.append('text').attr('x', 512).attr('y', H/2 - 10)
            .attr('text-anchor', 'middle').attr('font-size', '12px').attr('fill', '#1f2937')
            .attr('font-weight', 600).text('AI shift');

        var defs = svg.append('defs');
        defs.append('marker').attr('id', 'arr-cl').attr('viewBox', '0 0 10 10')
            .attr('refX', 8).attr('refY', 5).attr('markerWidth', 6).attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z').attr('fill', '#64748b');

        scenarios.forEach(function(scen, si) {
            var g = svg.append('g').style('opacity', 0);

            // Title — dark ink on light slide background
            g.append('text').attr('x', scen.x + barW / 2).attr('y', startY - 20)
                .attr('text-anchor', 'middle').attr('font-size', '18px')
                .attr('font-weight', 700).attr('fill', '#1f2937').text(scen.label);

            var cumY = startY;
            scen.segments.forEach(function(seg, i) {
                var segH = seg.pct * 260;
                var segG = g.append('g').style('opacity', 0);

                // Stronger fill so the bar reads clearly
                segG.append('rect').attr('x', scen.x).attr('y', cumY)
                    .attr('width', barW).attr('height', segH)
                    .attr('fill', seg.color).attr('fill-opacity', 0.18)
                    .attr('stroke', seg.color).attr('stroke-width', 1.5).attr('stroke-opacity', 0.6)
                    .attr('rx', 3);

                // Label inside bar — dark text for contrast
                var txtColor = darkText[seg.color] || '#1e293b';
                if (segH > 20) {
                    segG.append('text').attr('x', scen.x + 12).attr('y', cumY + segH / 2 + 1)
                        .attr('dominant-baseline', 'middle')
                        .attr('font-size', segH > 35 ? '12px' : '10px')
                        .attr('fill', txtColor).attr('font-weight', 600)
                        .text(seg.label);

                    segG.append('text').attr('x', scen.x + barW - 12).attr('y', cumY + segH / 2 + 1)
                        .attr('text-anchor', 'end').attr('dominant-baseline', 'middle')
                        .attr('font-size', '13px').attr('font-weight', 700)
                        .attr('fill', txtColor).text(Math.round(seg.pct * 100) + '%');
                }

                segG.transition().delay(300 + si * 500 + i * 100).duration(400)
                    .ease(d3.easeCubicOut).style('opacity', 1);

                cumY += segH;
            });

            g.transition().delay(200 + si * 400).duration(400).style('opacity', 1);
        });

        // Methodology sub-labels under column titles
        svg.append('text').attr('x', 80 + barW / 2).attr('y', startY - 5)
            .attr('text-anchor', 'middle').attr('font-size', '9px')
            .attr('fill', '#6b7280').attr('font-style', 'italic')
            .text('Microsoft Time Warp 2024 · IDC · JetBrains 2025');
        svg.append('text').attr('x', 570 + barW / 2).attr('y', startY - 5)
            .attr('text-anchor', 'middle').attr('font-size', '9px')
            .attr('fill', '#6b7280').attr('font-style', 'italic')
            .text('METR 2025 + Feb 2026 update · arXiv SLR 2025 · SO Survey');

        // Annotation: what freed up
        var annG = svg.append('g').style('opacity', 0);
        annG.append('text').attr('x', W / 2).attr('y', H - 18)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#1f2937').attr('font-weight', 600)
            .text('Freed: Architectural judgment.');

        // Discoverable source link
        annG.append('text').attr('x', W / 2).attr('y', H - 2)
            .attr('text-anchor', 'middle').attr('font-size', '9px')
            .attr('fill', '#6b7280').attr('font-style', 'italic')
            .attr('class', 'source-ref')
            .text('Sources & methodology → see Sources slide');

        annG.transition().delay(1800).duration(500).style('opacity', 1);
    }


    // ─── BLANK PAGE (Malevich + white paper diptych) ────────────
    // Left: Malevich's Black Square as the zero-point — the terrifying void
    // Right: The pristine white page — beautiful until you must mark it
    // Center: AI dissolves the threshold — the first mark appears
    function blankPage(container, config) {
        var W = 1050, H = 420;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var panelW = 320, panelH = 280, panelY = 30;
        var leftX = 50, rightX = W - 50 - panelW;
        var centerX = W / 2;

        // ── LEFT PANEL: Malevich's Black Square ──────────────
        var leftG = svg.append('g').style('opacity', 0);

        // Outer frame (gallery white border, then the square)
        leftG.append('rect').attr('x', leftX).attr('y', panelY)
            .attr('width', panelW).attr('height', panelH)
            .attr('fill', '#f5f0eb').attr('stroke', '#d4cdc4').attr('stroke-width', 1).attr('rx', 2);

        // The Black Square itself — inset like a painting
        var sqInset = 40;
        var sqSize = panelW - sqInset * 2;
        leftG.append('rect')
            .attr('x', leftX + sqInset).attr('y', panelY + 25)
            .attr('width', sqSize).attr('height', sqSize)
            .attr('fill', '#0a0a0a').attr('rx', 1);

        // Caption beneath
        leftG.append('text').attr('x', leftX + panelW / 2).attr('y', panelY + panelH + 22)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#374151').attr('font-weight', 700)
            .text('Kazimir Malevich, 1915');
        leftG.append('text').attr('x', leftX + panelW / 2).attr('y', panelY + panelH + 38)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#6b7280').attr('font-style', 'italic')
            .text('"The zero point of painting"');
        leftG.append('text').attr('x', leftX + panelW / 2).attr('y', panelY + panelH + 54)
            .attr('text-anchor', 'middle').attr('font-size', '9px')
            .attr('fill', '#6b7280')
            .text('Before creation, there is nothing. And nothing is terrifying.');

        leftG.transition().delay(300).duration(800).ease(d3.easeCubicOut).style('opacity', 1);

        // ── RIGHT PANEL: The White Page ──────────────────────
        var rightG = svg.append('g').style('opacity', 0);

        // Paper with subtle shadow (the beautiful unmarked sheet)
        rightG.append('rect').attr('x', rightX + 3).attr('y', panelY + 3)
            .attr('width', panelW).attr('height', panelH)
            .attr('fill', '#e5e7eb').attr('rx', 2); // shadow
        rightG.append('rect').attr('x', rightX).attr('y', panelY)
            .attr('width', panelW).attr('height', panelH)
            .attr('fill', '#ffffff').attr('stroke', '#d1d5db').attr('stroke-width', 0.5).attr('rx', 1);

        // Faint ruled lines (the invitation of structure)
        for (var li = 0; li < 9; li++) {
            var ly = panelY + 40 + li * 28;
            rightG.append('line')
                .attr('x1', rightX + 30).attr('y1', ly)
                .attr('x2', rightX + panelW - 30).attr('y2', ly)
                .attr('stroke', '#e5e7eb').attr('stroke-width', 0.5);
        }

        // Blinking cursor on the first line (the paralysis point)
        var cursor = rightG.append('rect')
            .attr('x', rightX + 30).attr('y', panelY + 32)
            .attr('width', 2).attr('height', 16)
            .attr('fill', '#374151');

        // Animate cursor blink
        function blink() {
            cursor.transition().duration(500).attr('fill-opacity', 0)
                .transition().duration(500).attr('fill-opacity', 1)
                .on('end', blink);
        }

        // Caption beneath
        rightG.append('text').attr('x', rightX + panelW / 2).attr('y', panelY + panelH + 22)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#374151').attr('font-weight', 700)
            .text('The Blank Page');
        rightG.append('text').attr('x', rightX + panelW / 2).attr('y', panelY + panelH + 38)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#6b7280').attr('font-style', 'italic')
            .text('It is not empty;');
        rightG.append('text').attr('x', rightX + panelW / 2).attr('y', panelY + panelH + 54)
            .attr('text-anchor', 'middle').attr('font-size', '9px')
            .attr('fill', '#6b7280')
            .text('it is crowded with unrealized beginnings.');

        rightG.transition().delay(600).duration(800).ease(d3.easeCubicOut).style('opacity', 1)
            .on('end', blink);

        // ── CENTER: The dissolution ──────────────────────────
        var midG = svg.append('g').style('opacity', 0);

        // Vertical line connecting the two worlds
        midG.append('line')
            .attr('x1', centerX).attr('y1', panelY + 40)
            .attr('x2', centerX).attr('y2', panelY + panelH - 40)
            .attr('stroke', '#d1d5db').attr('stroke-width', 1)
            .attr('stroke-dasharray', '4,4');

        // The pivot text
        midG.append('text').attr('x', centerX).attr('y', panelY + panelH / 2 - 24)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#6b7280').text('The obstacle was');
        midG.append('text').attr('x', centerX).attr('y', panelY + panelH / 2 - 4)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#1f2937').attr('font-weight', 700).text('the first mark.');
        midG.append('text').attr('x', centerX).attr('y', panelY + panelH / 2 + 20)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#6b7280').text('AI made the cost');
        midG.append('text').attr('x', centerX).attr('y', panelY + panelH / 2 + 40)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#1f2937').attr('font-weight', 700).text('zero.');

        // Small arrows pointing to each panel
        midG.append('text').attr('x', centerX - 50).attr('y', panelY + panelH / 2 + 5)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('fill', '#6b7280').text('←');
        midG.append('text').attr('x', centerX + 50).attr('y', panelY + panelH / 2 + 5)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('fill', '#6b7280').text('→');

        midG.transition().delay(1200).duration(600).ease(d3.easeCubicOut).style('opacity', 1);

        // ── BOTTOM: The shift statement ──────────────────────
        var bottomG = svg.append('g').style('opacity', 0);
        bottomG.append('text').attr('x', centerX).attr('y', H - 18)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#374151').attr('font-weight', 600)
            .text('The real work becomes curation and judgment — not generation.');
        bottomG.append('text').attr('x', centerX).attr('y', H - 2)
            .attr('text-anchor', 'middle').attr('font-size', '9px')
            .attr('fill', '#6b7280').attr('font-style', 'italic')
            .text('A plausible wrong answer is harder to catch than no answer at all.');

        bottomG.transition().delay(1800).duration(500).style('opacity', 1);

        // ══════════════════════════════════════════════════════════
        // PHASE 2 — Click to dissolve the blank page anxiety
        // Clinical data model appears on black, requirements on white
        // ══════════════════════════════════════════════════════════

        var phase2Triggered = false;

        // ── Left: Clinical data model (white on black) ──
        var sqX = leftX + sqInset;
        var sqY = panelY + 25;
        var modelG = svg.append('g').style('opacity', 0);

        // Entity boxes
        var entities = [
            { name: 'Patient', x: sqX + 20, y: sqY + 16, w: 72, h: 28 },
            { name: 'Order', x: sqX + 130, y: sqY + 16, w: 60, h: 28 },
            { name: 'Specimen', x: sqX + 20, y: sqY + 72, w: 76, h: 28 },
            { name: 'Accession', x: sqX + 130, y: sqY + 72, w: 80, h: 28 },
            { name: 'Result', x: sqX + 72, y: sqY + 128, w: 60, h: 28 },
            { name: 'Report', x: sqX + 160, y: sqY + 128, w: 60, h: 28 }
        ];

        entities.forEach(function (ent, i) {
            modelG.append('rect')
                .attr('x', ent.x).attr('y', ent.y)
                .attr('width', ent.w).attr('height', ent.h)
                .attr('rx', 3)
                .attr('fill', 'none')
                .attr('stroke', '#e5e7eb').attr('stroke-width', 1.2);

            modelG.append('text')
                .attr('x', ent.x + ent.w / 2).attr('y', ent.y + ent.h / 2 + 4)
                .attr('text-anchor', 'middle').attr('font-size', '10px')
                .attr('font-weight', '600').attr('fill', '#e5e7eb')
                .text(ent.name);
        });

        // Relationship lines
        var rels = [
            { x1: 92, y1: 30, x2: 130, y2: 30 },    // Patient → Order
            { x1: 58, y1: 44, x2: 58, y2: 72 },      // Patient → Specimen
            { x1: 170, y1: 44, x2: 170, y2: 72 },    // Order → Accession
            { x1: 96, y1: 100, x2: 102, y2: 128 },   // Specimen → Result
            { x1: 170, y1: 100, x2: 190, y2: 128 }   // Accession → Report
        ];

        rels.forEach(function (rel) {
            modelG.append('line')
                .attr('x1', sqX + rel.x1).attr('y1', sqY + rel.y1)
                .attr('x2', sqX + rel.x2).attr('y2', sqY + rel.y2)
                .attr('stroke', '#9ca3af').attr('stroke-width', 0.8)
                .attr('stroke-dasharray', '3,2');
        });

        // Small title in corner
        modelG.append('text')
            .attr('x', sqX + sqSize / 2).attr('y', sqY + sqSize - 12)
            .attr('text-anchor', 'middle').attr('font-size', '9px')
            .attr('fill', '#cbd5e1').attr('letter-spacing', '1px')
            .text('CLINICAL DATA MODEL');

        // ── Right: User requirements appearing ──
        var reqG = svg.append('g').style('opacity', 0);

        var reqLines = [
            { text: 'User Requirements', size: '12px', weight: '700', fill: '#1f2937', y: panelY + 42 },
            { text: '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500', size: '9px', weight: '400', fill: '#d1d5db', y: panelY + 54 },
            { text: '1. System shall accept specimen', size: '10px', weight: '400', fill: '#374151', y: panelY + 74 },
            { text: '   accessioning via barcode scan', size: '10px', weight: '400', fill: '#374151', y: panelY + 88 },
            { text: '2. Results must route to ordering', size: '10px', weight: '400', fill: '#374151', y: panelY + 110 },
            { text: '   provider within 4 hours', size: '10px', weight: '400', fill: '#374151', y: panelY + 124 },
            { text: '3. Critical values trigger alert', size: '10px', weight: '400', fill: '#374151', y: panelY + 146 },
            { text: '   to on-call pathologist', size: '10px', weight: '400', fill: '#374151', y: panelY + 160 },
            { text: '4. Audit trail for all result', size: '10px', weight: '400', fill: '#374151', y: panelY + 182 },
            { text: '   amendments and addenda', size: '10px', weight: '400', fill: '#374151', y: panelY + 196 },
            { text: '5. Integration with Epic via', size: '10px', weight: '400', fill: '#374151', y: panelY + 218 },
            { text: '   HL7 FHIR endpoints', size: '10px', weight: '400', fill: '#374151', y: panelY + 232 }
        ];

        reqLines.forEach(function (line) {
            reqG.append('text')
                .attr('x', rightX + 32).attr('y', line.y)
                .attr('font-size', line.size)
                .attr('font-weight', line.weight)
                .attr('fill', line.fill)
                .text(line.text);
        });

        // ── Click handler to trigger phase 2 ──
        svg.style('cursor', 'pointer');

        svg.on('click', function () {
            if (phase2Triggered) return;
            phase2Triggered = true;
            svg.style('cursor', 'default');

            // Stop cursor blink — hide it
            cursor.interrupt().attr('fill-opacity', 0);

            // Fade in the data model on the black square
            modelG.transition().duration(1200).ease(d3.easeCubicOut)
                .style('opacity', 1);

            // Fade in requirements on the white page (staggered by line)
            reqG.style('opacity', 1);
            reqG.selectAll('text').style('opacity', 0)
                .each(function (d, i) {
                    d3.select(this).transition()
                        .delay(400 + i * 120)
                        .duration(400)
                        .ease(d3.easeCubicOut)
                        .style('opacity', 1);
                });

            // Update center text
            midG.selectAll('text').transition().duration(400).style('opacity', 0);
            midG.transition().delay(600).duration(0).each(function () {
                var mg = d3.select(this);
                mg.selectAll('text').remove();

                mg.append('text').attr('x', centerX).attr('y', panelY + panelH / 2 - 16)
                    .attr('text-anchor', 'middle').attr('font-size', '11px')
                    .attr('fill', '#6b7280').style('opacity', 0)
                    .text('The cost of the first mark')
                    .transition().duration(600).style('opacity', 1);

                mg.append('text').attr('x', centerX).attr('y', panelY + panelH / 2 + 6)
                    .attr('text-anchor', 'middle').attr('font-size', '14px')
                    .attr('fill', '#065f46').attr('font-weight', 700).style('opacity', 0)
                    .text('is now zero.')
                    .transition().delay(200).duration(600).style('opacity', 1);

                mg.append('text').attr('x', centerX).attr('y', panelY + panelH / 2 + 34)
                    .attr('text-anchor', 'middle').attr('font-size', '11px')
                    .attr('fill', '#6b7280').style('opacity', 0)
                    .text('Now the real work begins.')
                    .transition().delay(500).duration(600).style('opacity', 1);
            });
        });
    }


    // ─── LIBERATION PATTERN (small multiples) ───────────────────
    // Four parallel collapses shown as before/after panels
    function liberationPattern(container, config) {
        var W = 1050, H = 420;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var patterns = [
            { constraint: 'Implementation\nBoilerplate', collapsed: 'First Draft\nCost', icon: '📝',
              color: '#3498db', detail: 'The cost of generating a first draft collapsed' },
            { constraint: 'Technology\nEvaluation', collapsed: 'Eval Tax', icon: '🔍',
              color: '#9b59b6', detail: 'The technology evaluation tax collapsed' },
            { constraint: 'Code Review\nas Ritual', collapsed: 'Blank-Canvas\nReview', icon: '👁️',
              color: '#e67e22', detail: 'The blank-canvas review problem collapsed' },
            { constraint: 'Slide Template\nas Only Format', collapsed: 'Switching\nCost', icon: '🖥️',
              color: '#27ae60', detail: 'The cost of code-driven presentation collapsed' }
        ];

        var cardW = 230, cardH = 300, gap = 20;
        var startX = (W - (cardW * 4 + gap * 3)) / 2;
        var startY = 30;

        patterns.forEach(function(pat, i) {
            var cx = startX + i * (cardW + gap);
            var g = svg.append('g').style('opacity', 0);

            // Card background
            g.append('rect').attr('x', cx).attr('y', startY).attr('width', cardW).attr('height', cardH)
                .attr('rx', 10).attr('fill', '#1e293b').attr('stroke', pat.color)
                .attr('stroke-width', 1).attr('stroke-opacity', 0.3);

            // Icon
            g.append('text').attr('x', cx + cardW / 2).attr('y', startY + 35)
                .attr('text-anchor', 'middle').attr('font-size', '24px').text(pat.icon);

            // "Before" block
            var bh = 70;
            g.append('rect').attr('x', cx + 15).attr('y', startY + 55).attr('width', cardW - 30).attr('height', bh)
                .attr('rx', 6).attr('fill', pat.color).attr('fill-opacity', 0.08)
                .attr('stroke', pat.color).attr('stroke-opacity', 0.2).attr('stroke-width', 1);

            // Constraint label (handle multiline)
            var cLines = pat.constraint.split('\n');
            cLines.forEach(function(line, li) {
                g.append('text').attr('x', cx + cardW / 2).attr('y', startY + 80 + li * 16)
                    .attr('text-anchor', 'middle').attr('font-size', '12px')
                    .attr('fill', '#e0e0e0').attr('font-weight', 600).text(line);
            });

            // Animated collapse arrow
            var arrowY = startY + 55 + bh + 10;
            var arrowG = g.append('g');

            // Tall bar that shrinks
            var tallBar = arrowG.append('rect').attr('x', cx + cardW / 2 - 20).attr('y', arrowY)
                .attr('width', 40).attr('height', 50)
                .attr('rx', 4).attr('fill', pat.color).attr('fill-opacity', 0.15)
                .attr('stroke', pat.color).attr('stroke-width', 1).attr('stroke-opacity', 0.4);

            // Arrow down
            arrowG.append('text').attr('x', cx + cardW / 2).attr('y', arrowY + 30)
                .attr('text-anchor', 'middle').attr('font-size', '18px')
                .attr('fill', pat.color).text('↓');

            // Collapse animation: bar shrinks after delay
            tallBar.transition().delay(1200 + i * 300).duration(800)
                .ease(d3.easeCubicIn)
                .attr('height', 8).attr('y', arrowY + 42).attr('fill-opacity', 0.4);

            // "After" block (collapsed state)
            var afterY = arrowY + 60;
            g.append('rect').attr('x', cx + 15).attr('y', afterY).attr('width', cardW - 30).attr('height', 30)
                .attr('rx', 6).attr('fill', pat.color).attr('fill-opacity', 0.2)
                .attr('stroke', pat.color).attr('stroke-opacity', 0.5).attr('stroke-width', 1.5);

            var aLines = pat.collapsed.split('\n');
            aLines.forEach(function(line, li) {
                g.append('text').attr('x', cx + cardW / 2).attr('y', afterY + 14 + li * 14)
                    .attr('text-anchor', 'middle').attr('font-size', '10px')
                    .attr('fill', pat.color).attr('font-weight', 700).text(line);
            });

            // Detail text at bottom
            g.append('text').attr('x', cx + cardW / 2).attr('y', startY + cardH - 15)
                .attr('text-anchor', 'middle').attr('font-size', '9px')
                .attr('fill', '#94a3b8').attr('font-style', 'italic')
                .text(pat.detail);

            // Staggered entry
            g.transition().delay(200 + i * 150).duration(500)
                .ease(d3.easeCubicOut).style('opacity', 1);
        });

        // Bottom annotation
        var ann = svg.append('g').style('opacity', 0);
        ann.append('text').attr('x', W / 2).attr('y', H - 15)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('fill', '#ef5350').attr('font-weight', 700)
            .text('AI changed the price.');
        ann.transition().delay(2500).duration(500).style('opacity', 1);
    }


    // ─── STACK COMPARISON (structured data table) ───────────────
    // Elasticsearch vs Meilisearch as a Tufte-style comparison matrix
    function stackComparison(container, config) {
        var W = 1050, H = 380;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var criteria = [
            { label: 'Maturity',       elastic: 4.5, meili: 3.0 },
            { label: 'Setup Time',     elastic: 2.0, meili: 4.5 },
            { label: 'Resource Weight', elastic: 1.5, meili: 4.5 },
            { label: 'Typo Tolerance', elastic: 3.0, meili: 5.0 },
            { label: 'Clustering',     elastic: 5.0, meili: 1.0 },
            { label: 'Analytics Suite', elastic: 5.0, meili: 2.0 },
            { label: 'Relevance OOTB', elastic: 3.0, meili: 4.5 }
        ];

        var leftX = 350, rightX = 700, labelX = 200;
        var startY = 70, rowH = 38;
        var maxBarW = 120;

        // Headers
        svg.append('text').attr('x', leftX + maxBarW / 2).attr('y', 40)
            .attr('text-anchor', 'middle').attr('font-size', '15px')
            .attr('font-weight', 700).attr('fill', '#c05702').text('Elasticsearch');
        svg.append('text').attr('x', rightX + maxBarW / 2).attr('y', 40)
            .attr('text-anchor', 'middle').attr('font-size', '15px')
            .attr('font-weight', 700).attr('fill', '#1e8449').text('Meilisearch');

        criteria.forEach(function(crit, i) {
            var y = startY + i * rowH;
            var g = svg.append('g').style('opacity', 0);

            // Criterion label
            g.append('text').attr('x', labelX).attr('y', y + 14)
                .attr('text-anchor', 'end').attr('font-size', '12px')
                .attr('fill', '#64748b').attr('font-weight', 500).text(crit.label);

            // Dotted baseline
            g.append('line').attr('x1', labelX + 15).attr('y1', y + 10)
                .attr('x2', rightX + maxBarW + 30).attr('y2', y + 10)
                .attr('stroke', '#334155').attr('stroke-width', 0.5).attr('stroke-dasharray', '2,3');

            // Elastic bar (grows right from center)
            g.append('rect').attr('x', leftX).attr('y', y + 2)
                .attr('width', 0).attr('height', 16).attr('rx', 3)
                .attr('fill', '#e67e22').attr('fill-opacity', 0.25)
                .attr('stroke', '#e67e22').attr('stroke-width', 1).attr('stroke-opacity', 0.5)
                .transition().delay(400 + i * 80).duration(600)
                .attr('width', (crit.elastic / 5) * maxBarW);

            // Meili bar
            g.append('rect').attr('x', rightX).attr('y', y + 2)
                .attr('width', 0).attr('height', 16).attr('rx', 3)
                .attr('fill', '#27ae60').attr('fill-opacity', 0.25)
                .attr('stroke', '#27ae60').attr('stroke-width', 1).attr('stroke-opacity', 0.5)
                .transition().delay(400 + i * 80).duration(600)
                .attr('width', (crit.meili / 5) * maxBarW);

            // Score labels
            g.append('text').attr('x', leftX + (crit.elastic / 5) * maxBarW + 8).attr('y', y + 14)
                .attr('font-size', '10px').attr('fill', '#c05702').attr('font-weight', 600)
                .style('opacity', 0).text(crit.elastic.toFixed(1))
                .transition().delay(800 + i * 80).duration(300).style('opacity', 1);

            g.append('text').attr('x', rightX + (crit.meili / 5) * maxBarW + 8).attr('y', y + 14)
                .attr('font-size', '10px').attr('fill', '#1e8449').attr('font-weight', 600)
                .style('opacity', 0).text(crit.meili.toFixed(1))
                .transition().delay(800 + i * 80).duration(300).style('opacity', 1);

            g.transition().delay(200 + i * 60).duration(400).style('opacity', 1);
        });

        // Annotation
        svg.append('text').attr('x', W / 2).attr('y', H - 20)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#475569').attr('font-style', 'italic')
            .text('AI gives you access to more options. It does not tell you which one to pick.');
    }


    // ─── XENONYM BROWSER FRAME ──────────────────────────────────
    // Simulated browser window with schema → generated data preview
    function xenonymBrowser(container, config) {
        var W = 1050, H = 440;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Browser chrome
        var chromeH = 36;
        svg.append('rect').attr('width', W).attr('height', H).attr('rx', 10)
            .attr('fill', '#1e293b').attr('stroke', '#475569').attr('stroke-width', 1.5);
        svg.append('rect').attr('width', W).attr('height', chromeH).attr('rx', 10)
            .attr('fill', '#334155');
        // Hide bottom radius of chrome bar
        svg.append('rect').attr('y', chromeH - 10).attr('width', W).attr('height', 10)
            .attr('fill', '#334155');

        // Traffic lights
        [{ c: '#f87171', x: 18 }, { c: '#F59E0B', x: 34 }, { c: '#22C55E', x: 50 }].forEach(function(d) {
            svg.append('circle').attr('cx', d.x).attr('cy', chromeH / 2).attr('r', 5).attr('fill', d.c);
        });

        // URL bar
        svg.append('rect').attr('x', 120).attr('y', 8).attr('width', 500).attr('height', 20)
            .attr('rx', 10).attr('fill', '#1e293b');
        svg.append('text').attr('x', 135).attr('y', 22)
            .attr('font-size', '10px').attr('fill', '#94a3b8')
            .attr('font-family', "'JetBrains Mono', monospace")
            .text('🔒 xenonym.openpathology.org');

        // Link button
        var linkG = svg.append('g').style('cursor', 'pointer');
        linkG.append('rect').attr('x', 640).attr('y', 8).attr('width', 100).attr('height', 20)
            .attr('rx', 10).attr('fill', '#2563eb');
        linkG.append('text').attr('x', 690).attr('y', 22).attr('text-anchor', 'middle')
            .attr('font-size', '9px').attr('fill', 'white').attr('font-weight', 600).text('↗ Open Live');

        // Content area
        var contentY = chromeH + 10;

        // Left panel: Schema
        var schemaX = 20, schemaW = 350, schemaH = H - contentY - 20;
        svg.append('rect').attr('x', schemaX).attr('y', contentY)
            .attr('width', schemaW).attr('height', schemaH)
            .attr('rx', 8).attr('fill', '#0f172a').attr('stroke', '#334155').attr('stroke-width', 1);

        svg.append('text').attr('x', schemaX + 15).attr('y', contentY + 22)
            .attr('font-size', '10px').attr('fill', '#94a3b8').attr('font-weight', 600)
            .attr('text-transform', 'uppercase').attr('letter-spacing', '0.05em').text('SCHEMA INPUT');

        // JSON schema lines
        var schemaLines = [
            '{ "patient": {',
            '    "firstName": "xenonym:name",',
            '    "lastName": "xenonym:name",',
            '    "mrn": "xenonym:id(8)",',
            '    "dob": "xenonym:date",',
            '    "diagnosis": "xenonym:dx",',
            '    "specimen": {',
            '      "type": "xenonym:tissue",',
            '      "accession": "xenonym:acc"',
            '    }',
            '  }',
            '}'
        ];

        schemaLines.forEach(function(line, i) {
            svg.append('text').attr('x', schemaX + 20).attr('y', contentY + 50 + i * 18)
                .attr('font-size', '10px').attr('fill', '#e2e8f0')
                .attr('font-family', "'JetBrains Mono', monospace")
                .style('opacity', 0)
                .text(line)
                .transition().delay(300 + i * 60).duration(300).style('opacity', 1);
        });

        // Right panel: Generated output
        var outX = 400, outW = W - outX - 20;
        svg.append('rect').attr('x', outX).attr('y', contentY)
            .attr('width', outW).attr('height', schemaH)
            .attr('rx', 8).attr('fill', '#0f172a').attr('stroke', '#334155').attr('stroke-width', 1);

        svg.append('text').attr('x', outX + 15).attr('y', contentY + 22)
            .attr('font-size', '10px').attr('fill', '#22C55E').attr('font-weight', 600)
            .attr('text-transform', 'uppercase').attr('letter-spacing', '0.05em').text('GENERATED RECORDS');

        // Generated sample names (Xenonym-style)
        var generatedRecords = [
            { name: 'Kovani Trebesh',    mrn: '47382916', dx: 'Adenocarcinoma',          acc: 'S26-4821' },
            { name: 'Lirata Mendova',    mrn: '58291047', dx: 'Squamous cell carcinoma', acc: 'S26-4822' },
            { name: 'Selmak Durova',     mrn: '93817264', dx: 'Melanoma NOS',            acc: 'S26-4823' },
            { name: 'Nontra Null',       mrn: '00000000', dx: '⚠ SQL injection test',   acc: 'S26-TEST' },
            { name: 'Fenrik Čapešova',   mrn: '62918374', dx: 'Papillary thyroid ca.',   acc: 'S26-4824' },
            { name: "O'Mara-Sélekt",     mrn: '71629483', dx: '⚠ Edge case: apostrophe', acc: 'S26-ADV1' },
            { name: 'Volashi Nkembe',    mrn: '84726195', dx: 'Ductal carcinoma in situ', acc: 'S26-4825' }
        ];

        // Table header
        var cols = [
            { label: 'Name', x: outX + 15, w: 140 },
            { label: 'MRN', x: outX + 160, w: 80 },
            { label: 'Diagnosis', x: outX + 250, w: 200 },
            { label: 'Accession', x: outX + 460, w: 80 }
        ];

        cols.forEach(function(col) {
            svg.append('text').attr('x', col.x).attr('y', contentY + 50)
                .attr('font-size', '9px').attr('fill', '#94a3b8').attr('font-weight', 600)
                .text(col.label);
        });

        svg.append('line').attr('x1', outX + 10).attr('y1', contentY + 56)
            .attr('x2', outX + outW - 10).attr('y2', contentY + 56)
            .attr('stroke', '#334155').attr('stroke-width', 0.5);

        generatedRecords.forEach(function(rec, i) {
            var ry = contentY + 70 + i * 42;
            var isAdversarial = rec.name === 'Nontra Null' || rec.name === "O'Mara-Sélekt";
            var g = svg.append('g').style('opacity', 0);

            if (isAdversarial) {
                g.append('rect').attr('x', outX + 10).attr('y', ry - 10).attr('width', outW - 20).attr('height', 36)
                    .attr('rx', 4).attr('fill', '#c0392b').attr('fill-opacity', 0.08)
                    .attr('stroke', '#c0392b').attr('stroke-width', 0.5).attr('stroke-opacity', 0.3);
            }

            g.append('text').attr('x', cols[0].x).attr('y', ry + 4)
                .attr('font-size', '11px').attr('fill', isAdversarial ? '#f87171' : '#e2e8f0')
                .attr('font-weight', 600).text(rec.name);
            g.append('text').attr('x', cols[1].x).attr('y', ry + 4)
                .attr('font-size', '10px').attr('fill', '#94a3b8')
                .attr('font-family', "'JetBrains Mono', monospace").text(rec.mrn);
            g.append('text').attr('x', cols[2].x).attr('y', ry + 4)
                .attr('font-size', '10px').attr('fill', '#94a3b8').text(rec.dx);
            g.append('text').attr('x', cols[3].x).attr('y', ry + 4)
                .attr('font-size', '10px').attr('fill', '#94a3b8')
                .attr('font-family', "'JetBrains Mono', monospace").text(rec.acc);

            // Subtitle line
            if (rec.name === 'Nontra Null') {
                g.append('text').attr('x', cols[0].x).attr('y', ry + 18)
                    .attr('font-size', '8px').attr('fill', '#f87171').attr('font-style', 'italic')
                    .text('Bobby Tables is not a joke. It is a test case.');
            }

            g.transition().delay(800 + i * 100).duration(400).ease(d3.easeCubicOut).style('opacity', 1);
        });
    }


    // ─── META PRESENTATION ARCHITECTURE ─────────────────────────
    // Shows JSON → Render pipeline with live split-screen concept
    function presentationArchitecture(container, config) {
        var W = 1050, H = 400;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Left side: JSON layer
        var jsonX = 40, jsonW = 300, jsonH = 300, jsonY = 50;
        svg.append('rect').attr('x', jsonX).attr('y', jsonY).attr('width', jsonW).attr('height', jsonH)
            .attr('rx', 10).attr('fill', '#0f172a').attr('stroke', '#3b82f6')
            .attr('stroke-width', 1.5).attr('stroke-opacity', 0.4);

        svg.append('text').attr('x', jsonX + jsonW / 2).attr('y', jsonY - 10)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#60a5fa').attr('font-weight', 700).text('CONTENT LAYER');
        svg.append('text').attr('x', jsonX + jsonW / 2).attr('y', jsonY + 20)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#94a3b8').text('Structured JSON — version-controllable');

        // JSON snippet
        var jsonLines = [
            '{ "id": "governing-principle",',
            '  "type": "content",',
            '  "title": "The Governing..",',
            '  "takeaway": {',
            '    "text": "Most tool...",',
            '    "comment": "Speaker note"',
            '  }',
            '}'
        ];
        jsonLines.forEach(function(line, i) {
            svg.append('text').attr('x', jsonX + 20).attr('y', jsonY + 50 + i * 22)
                .attr('font-size', '10px').attr('fill', '#94a3b8')
                .attr('font-family', "'JetBrains Mono', monospace")
                .style('opacity', 0).text(line)
                .transition().delay(200 + i * 60).duration(300).style('opacity', 1);
        });

        // Properties labels
        var props = [
            { label: 'Human-readable', y: jsonY + jsonH - 60 },
            { label: 'AI-reviewable', y: jsonY + jsonH - 40 },
            { label: 'Git-diffable', y: jsonY + jsonH - 20 }
        ];
        props.forEach(function(p, i) {
            svg.append('text').attr('x', jsonX + 15).attr('y', p.y)
                .attr('font-size', '9px').attr('fill', '#22C55E').attr('font-weight', 500)
                .style('opacity', 0).text('✓ ' + p.label)
                .transition().delay(800 + i * 100).duration(300).style('opacity', 1);
        });

        // Center: Processing arrow
        var arrowCX = W / 2;
        var arrowG = svg.append('g').style('opacity', 0);

        arrowG.append('rect').attr('x', arrowCX - 60).attr('y', 150).attr('width', 120).attr('height', 60)
            .attr('rx', 30).attr('fill', '#1e293b').attr('stroke', '#475569').attr('stroke-width', 1);
        arrowG.append('text').attr('x', arrowCX).attr('y', 175)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#f0f0f0').attr('font-weight', 600).text('Slide Engine');
        arrowG.append('text').attr('x', arrowCX).attr('y', 195)
            .attr('text-anchor', 'middle').attr('font-size', '9px')
            .attr('fill', '#94a3b8').text('D3 · Reveal.js · CSS');

        // Arrows in/out
        arrowG.append('line').attr('x1', jsonX + jsonW + 5).attr('y1', 180)
            .attr('x2', arrowCX - 65).attr('y2', 180)
            .attr('stroke', '#3b82f6').attr('stroke-width', 1.5)
            .attr('marker-end', 'url(#arr-meta)');

        arrowG.transition().delay(600).duration(500).style('opacity', 1);

        // Right side: Rendered output
        var outX = W - 340, outW = 300, outH = 300, outY = 50;
        svg.append('rect').attr('x', outX).attr('y', outY).attr('width', outW).attr('height', outH)
            .attr('rx', 10).attr('fill', '#0f172a').attr('stroke', '#27ae60')
            .attr('stroke-width', 1.5).attr('stroke-opacity', 0.4);

        svg.append('text').attr('x', outX + outW / 2).attr('y', outY - 10)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#27ae60').attr('font-weight', 700).text('RENDER LAYER');
        svg.append('text').attr('x', outX + outW / 2).attr('y', outY + 20)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#94a3b8').text('Browser application — full expressive power');

        // Arrow from engine to render
        svg.append('line').attr('x1', arrowCX + 65).attr('y1', 180)
            .attr('x2', outX - 5).attr('y2', 180)
            .attr('stroke', '#27ae60').attr('stroke-width', 1.5)
            .attr('marker-end', 'url(#arr-meta-g)').style('opacity', 0)
            .transition().delay(800).duration(400).style('opacity', 1);

        // Simulated rendered slide
        var rsG = svg.append('g').style('opacity', 0);
        rsG.append('rect').attr('x', outX + 20).attr('y', outY + 40).attr('width', outW - 40).attr('height', 180)
            .attr('rx', 6).attr('fill', '#1e293b');
        rsG.append('text').attr('x', outX + outW / 2).attr('y', outY + 80)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#f0f0f0').attr('font-weight', 700).text('The Governing Principle');
        rsG.append('text').attr('x', outX + outW / 2).attr('y', outY + 120)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#cbd5e1').attr('font-style', 'italic').text('"Automate what you do,');
        rsG.append('text').attr('x', outX + outW / 2).attr('y', outY + 140)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#cbd5e1').attr('font-style', 'italic').text('not do what is automated."');

        // Capabilities
        var caps = ['Live D3 visualizations', 'Interactive polling', 'Embedded applications'];
        caps.forEach(function(cap, i) {
            rsG.append('text').attr('x', outX + 25).attr('y', outY + outH - 50 + i * 16)
                .attr('font-size', '9px').attr('fill', '#27ae60').attr('font-weight', 500)
                .text('◆ ' + cap);
        });

        rsG.transition().delay(1000).duration(500).style('opacity', 1);

        // Bottom: "Separation of content from presentation — the Tufte principle applied"
        svg.append('text').attr('x', W / 2).attr('y', H - 15)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#94a3b8').attr('font-weight', 600)
            .text('Separation of content from presentation — the Tufte principle applied, not described.')
            .style('opacity', 0).transition().delay(1500).duration(500).style('opacity', 1);

        // Arrow markers
        var defs = svg.append('defs');
        defs.append('marker').attr('id', 'arr-meta').attr('viewBox', '0 0 10 10')
            .attr('refX', 8).attr('refY', 5).attr('markerWidth', 6).attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z').attr('fill', '#3b82f6');
        defs.append('marker').attr('id', 'arr-meta-g').attr('viewBox', '0 0 10 10')
            .attr('refX', 8).attr('refY', 5).attr('markerWidth', 6).attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z').attr('fill', '#27ae60');
    }


    // ─── TUFTE TIMELINE (Minard-style) ────────────────────────
    // The slide about Tufte's critique was itself a bulleted list.
    // This visualization resolves the irony: a multi-variable
    // Minard-inspired graphic encoding PowerPoint dominance,
    // critique accumulation, switching cost, and the AI inflection.
    function tufteTimeline(container, config) {
        var W = 1100, H = 460;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var tip = _createTooltip(container);

        // ── Layout regions (tuned to avoid all edge clipping) ──
        var margin = { left: 95, right: 35, top: 8, bandTop: 38, bandH: 78, eventY: 168, costTop: 230, costH: 114, bottom: 38 };
        var plotW = W - margin.left - margin.right;

        // ── Time scale ──
        var xScale = d3.scaleLinear().domain([2003, 2026]).range([margin.left, margin.left + plotW]);

        // ── BAND 1: PowerPoint dominance (narrower for cleaner layout) ──
        var pptData = [
            { year: 2003, width: 30 }, { year: 2006, width: 32 }, { year: 2010, width: 34 },
            { year: 2014, width: 34 }, { year: 2018, width: 33 }, { year: 2020, width: 33 },
            { year: 2022, width: 31 }, { year: 2023, width: 29 }, { year: 2024, width: 24 },
            { year: 2025, width: 18 }, { year: 2026, width: 12 }
        ];

        var bandMid = margin.bandTop + margin.bandH / 2;

        var areaPath = d3.area().curve(d3.curveMonotoneX)
            .x(function(d) { return xScale(d.year); })
            .y0(function(d) { return bandMid + d.width; })
            .y1(function(d) { return bandMid - d.width; });

        // Gradient: warm to cooling as dominance erodes
        var defs = svg.append('defs');
        var bandGrad = defs.append('linearGradient').attr('id', 'ppt-band-grad')
            .attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%');
        bandGrad.append('stop').attr('offset', '0%').attr('stop-color', '#e67e22').attr('stop-opacity', 0.35);
        bandGrad.append('stop').attr('offset', '70%').attr('stop-color', '#e67e22').attr('stop-opacity', 0.25);
        bandGrad.append('stop').attr('offset', '100%').attr('stop-color', '#e67e22').attr('stop-opacity', 0.08);

        // Clip for reveal — starts at x=0 so left-edge labels are never clipped
        var clipId = 'tufte-clip-' + Math.random().toString(36).substr(2, 5);
        var clip = defs.append('clipPath').attr('id', clipId);
        var clipRect = clip.append('rect').attr('x', 0).attr('y', 0)
            .attr('width', 0).attr('height', H);

        var bandG = svg.append('g').attr('clip-path', 'url(#' + clipId + ')');

        // ── Highlight helpers (shared by bands, cost chart, and legend) ──
        var pptBandPath, altBandPath, costAreaPath, costLinePath;

        function highlightPPT(on) {
            pptBandPath.transition().duration(200)
                .style('filter', on ? 'brightness(1.8) drop-shadow(0 0 8px rgba(230,126,34,0.5))' : null)
                .attr('stroke-opacity', on ? 0.9 : 0.4).attr('stroke-width', on ? 2.5 : 1.5);
        }
        function highlightAlt(on) {
            altBandPath.transition().duration(200)
                .style('filter', on ? 'brightness(1.8) drop-shadow(0 0 8px rgba(39,174,96,0.5))' : null)
                .attr('stroke-opacity', on ? 0.9 : 0.5).attr('stroke-width', on ? 2.5 : 1.5);
        }
        function highlightCost(on) {
            costLinePath.transition().duration(200).attr('stroke-width', on ? 4 : 2.5);
            costAreaPath.transition().duration(200)
                .style('filter', on ? 'brightness(1.5) drop-shadow(0 0 6px rgba(192,57,43,0.4))' : null);
        }

        // ── PPT band (interactive) ──
        pptBandPath = bandG.append('path').datum(pptData)
            .attr('d', areaPath)
            .attr('fill', 'url(#ppt-band-grad)')
            .attr('stroke', '#e67e22').attr('stroke-width', 1.5).attr('stroke-opacity', 0.4)
            .style('cursor', 'pointer');

        pptBandPath.on('mouseenter', function() { highlightPPT(true); })
                   .on('mouseleave', function() { highlightPPT(false); });

        // Band label
        bandG.append('text').attr('x', xScale(2011)).attr('y', bandMid + 4)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#b35a00').attr('font-weight', 700).attr('letter-spacing', '2px')
            .text('POWERPOINT DOMINANCE');

        // ── CODE-BASED ALTERNATIVES band (diverges ~2023) ──
        var altOffset = bandMid + 34;
        var altData = [
            { year: 2020, width: 0 }, { year: 2022, width: 1 },
            { year: 2023, width: 4 }, { year: 2024, width: 12 },
            { year: 2025, width: 20 }, { year: 2026, width: 28 }
        ];

        var altGrad = defs.append('linearGradient').attr('id', 'alt-band-grad')
            .attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%');
        altGrad.append('stop').attr('offset', '0%').attr('stop-color', '#27ae60').attr('stop-opacity', 0.05);
        altGrad.append('stop').attr('offset', '100%').attr('stop-color', '#27ae60').attr('stop-opacity', 0.35);

        var altAreaPath = d3.area().curve(d3.curveMonotoneX)
            .x(function(d) { return xScale(d.year); })
            .y0(function(d) { return altOffset + d.width; })
            .y1(function(d) { return altOffset; });

        altBandPath = bandG.append('path').datum(altData)
            .attr('d', altAreaPath)
            .attr('fill', 'url(#alt-band-grad)')
            .attr('stroke', '#27ae60').attr('stroke-width', 1.5).attr('stroke-opacity', 0.5)
            .style('cursor', 'pointer');

        altBandPath.on('mouseenter', function() { highlightAlt(true); })
                   .on('mouseleave', function() { highlightAlt(false); });

        bandG.append('text').attr('x', xScale(2025.5)).attr('y', altOffset + 18)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#1a7a42').attr('font-weight', 700)
            .text('CODE-BASED');

        // ── EVENTS: critique milestones (dates & references verified) ──
        var events = [
            { year: 2003.5, label: 'Cognitive Style\nof PowerPoint', type: 'book', color: '#3498db',
              url: 'https://www.edwardtufte.com/book/the-cognitive-style-of-powerpoint-pitching-out-corrupts-within-ebook/',
              tip: '<strong>2003 — The Cognitive Style of PowerPoint</strong><br>Tufte publishes his seminal critique. PowerPoint "elevates format over content, betraying an attitude of commercialism that turns everything into a sales pitch."<br><a href="https://www.edwardtufte.com/book/the-cognitive-style-of-powerpoint-pitching-out-corrupts-within-ebook/" target="_blank" style="color:#3498db;font-size:11px">Source ↗</a>' },
            { year: 2004.3, label: '', type: 'analysis', color: '#e74c3c',
              url: 'https://www.edwardtufte.com/bboard/q-and-a-fetch-msg?msg_id=0001yB',
              tip: '<strong>2003 — NASA Columbia Analysis</strong><br>Tufte demonstrates how PowerPoint\'s nested bullet format obscured the engineering data that could have prevented the Columbia disaster. The critique becomes canonical.<br><a href="https://www.edwardtufte.com/bboard/q-and-a-fetch-msg?msg_id=0001yB" target="_blank" style="color:#e74c3c;font-size:11px">Source ↗</a>' },
            { year: 2006, label: 'Beautiful\nEvidence', type: 'book', color: '#3498db',
              url: 'https://www.edwardtufte.com/book/beautiful-evidence/',
              tip: '<strong>2006 — Beautiful Evidence</strong><br>Tufte\'s fourth book extends the argument: evidence presentations should maximize data density, not minimize cognitive demand. The slideware chapter is devastating.<br><a href="https://www.edwardtufte.com/book/beautiful-evidence/" target="_blank" style="color:#3498db;font-size:11px">Source ↗</a>' },
            { year: 2010, label: 'Bumiller NYT:\n"Enemy Is PPT"', type: 'press', color: '#f39c12',
              url: 'https://www.nytimes.com/2010/04/27/world/27powerpoint.html',
              tip: '<strong>Apr 2010 — "We Have Met the Enemy and He Is PowerPoint"</strong><br>Elisabeth Bumiller\'s New York Times article. Gen. McChrystal\'s famous reaction to the Afghanistan spaghetti slide. The critique goes mainstream.<br><a href="https://www.nytimes.com/2010/04/27/world/27powerpoint.html" target="_blank" style="color:#f39c12;font-size:11px">Source ↗</a>' },
            { year: 2011.5, label: '', type: 'paper', color: '#9b59b6',
              url: 'https://www.sciencedirect.com/science/article/abs/pii/S0747563211002603',
              tip: '<strong>2011 — Academic Literature</strong><br>Peer-reviewed research in <em>Computers in Human Behavior</em> documents PowerPoint\'s effects on cognition and decision quality. The critique enters the academic mainstream.<br><a href="https://www.sciencedirect.com/science/article/abs/pii/S0747563211002603" target="_blank" style="color:#9b59b6;font-size:11px">Source ↗</a>' },
            { year: 2015, label: 'PPT Designer:\nReform Within', type: 'paper', color: '#9b59b6',
              url: 'https://www.microsoft.com/en-us/microsoft-365/blog/2015/11/13/the-evolution-of-powerpoint-introducing-designer-and-morph/',
              tip: '<strong>Nov 2015 — PowerPoint Designer &amp; Morph</strong><br>Microsoft introduces AI-powered slide design. Rather than questioning the format, they invest in making slides look better automatically. The fundamental constraint — the slide as the unit of thought — remains unaddressed.<br><a href="https://www.microsoft.com/en-us/microsoft-365/blog/2015/11/13/the-evolution-of-powerpoint-introducing-designer-and-morph/" target="_blank" style="color:#9b59b6;font-size:11px">Source ↗</a>' },
            { year: 2018, label: 'Bezos Memo\nBans PPT', type: 'event', color: '#f39c12',
              url: 'https://www.inc.com/carmine-gallo/jeff-bezos-bans-powerpoint-in-meetings-his-replacement-is-brilliant.html',
              tip: '<strong>2018 — Amazon Bans PowerPoint</strong><br>In his 2018 annual letter, Bezos confirms the six-page narrative memo rule. A high-profile exit from slideware — but the alternative trades one constraint for another.<br><a href="https://www.inc.com/carmine-gallo/jeff-bezos-bans-powerpoint-in-meetings-his-replacement-is-brilliant.html" target="_blank" style="color:#f39c12;font-size:11px">Source ↗</a>' },
            { year: 2023.5, label: 'AI collapses\nswitching cost', type: 'inflection', color: '#27ae60',
              url: 'https://github.blog/2023-03-22-github-copilot-x-the-ai-powered-developer-experience/',
              tip: '<strong>2023 — The Inflection</strong><br>GitHub Copilot X and ChatGPT make code-based presentations viable for non-programmers. The switching cost — the only thing protecting PowerPoint\'s dominance — collapses.<br><a href="https://github.blog/2023-03-22-github-copilot-x-the-ai-powered-developer-experience/" target="_blank" style="color:#27ae60;font-size:11px">Source ↗</a>' },
            { year: 2025.8, label: 'This\npresentation', type: 'proof', color: '#27ae60',
              url: null,
              tip: '<strong>2025 — The Proof</strong><br>You are looking at it. A JSON document rendered by a browser application. Each slide is a typed component. The visualizations are D3.js. The medium makes the argument.' }
        ];

        var eY = margin.eventY;
        var evtG = bandG.append('g');

        events.forEach(function(evt, i) {
            var ex = xScale(evt.year);
            var g = evtG.append('g').style('opacity', 0);

            // Vertical connector from band to event
            var connTop = bandMid + (evt.type === 'inflection' || evt.type === 'proof' ? 34 : 32);
            g.append('line').attr('x1', ex).attr('y1', connTop).attr('x2', ex).attr('y2', eY - 16)
                .attr('stroke', evt.color).attr('stroke-width', 1)
                .attr('stroke-dasharray', evt.type === 'inflection' ? 'none' : '3,3')
                .attr('stroke-opacity', 0.5);

            // Event dot
            var dotR = evt.type === 'inflection' || evt.type === 'proof' ? 6 : 4;
            g.append('circle').attr('cx', ex).attr('cy', eY - 16)
                .attr('r', dotR).attr('fill', evt.color).attr('fill-opacity', 0.9)
                .attr('stroke', evt.color).attr('stroke-width', 1.5);

            // Label — empty labels are tooltip-only; edge labels use smart anchoring
            var lines = evt.label ? evt.label.split('\n') : [];
            var textAnchor = 'middle';
            var textX = ex;
            // Prevent left-edge clipping: nudge label rightward if too close
            if (ex < margin.left + 45 && lines.length > 0) {
                textAnchor = 'start';
                textX = ex - 8;
            }
            // Prevent right-edge clipping
            if (ex > W - margin.right - 45 && lines.length > 0) {
                textAnchor = 'end';
                textX = ex + 8;
            }

            lines.forEach(function(line, li) {
                g.append('text').attr('x', textX).attr('y', eY + li * 13)
                    .attr('text-anchor', textAnchor).attr('font-size', '9px')
                    .attr('fill', evt.color).attr('font-weight', evt.type === 'inflection' ? 700 : 500)
                    .text(line);
            });

            // Type icon below label (or near dot if no label)
            var iconY = lines.length > 0 ? eY + lines.length * 13 + 4 : eY + 2;
            var icons = { book: '\ud83d\udcd5', analysis: '\u26a0', paper: '\ud83d\udcc4', press: '\ud83d\udcf0', event: '\ud83d\udeab', inflection: '\u26a1', proof: '\u25c6' };
            g.append('text').attr('x', ex).attr('y', iconY)
                .attr('text-anchor', 'middle').attr('font-size', '11px')
                .text(icons[evt.type] || '\u2022');

            // Tooltip interaction
            var hitArea = g.append('rect').attr('x', ex - 35).attr('y', eY - 24)
                .attr('width', 70).attr('height', 55)
                .attr('fill', 'transparent').attr('cursor', 'pointer');

            hitArea.on('mouseenter', function() {
                _showTooltip(tip, evt.tip, Math.min(Math.max(ex - 130, 10), W - 290), eY + 50);
            }).on('mouseleave', function() {
                _hideTooltip(tip);
            }).on('click', function() {
                if (evt.url) window.open(evt.url, '_blank');
            });

            g.transition().delay(600 + i * 180).duration(400).style('opacity', 1);
        });

        // ── BOTTOM CHART: Switching Cost (interactive) ──
        var costY = margin.costTop;
        var costH = margin.costH;
        var costScale = d3.scaleLinear().domain([0, 100]).range([costY + costH, costY]);

        var costData = [
            { year: 2003, cost: 95 }, { year: 2006, cost: 93 }, { year: 2010, cost: 90 },
            { year: 2014, cost: 88 }, { year: 2018, cost: 85 }, { year: 2020, cost: 80 },
            { year: 2022, cost: 70 }, { year: 2023, cost: 45 }, { year: 2024, cost: 22 },
            { year: 2025, cost: 12 }, { year: 2026, cost: 6 }
        ];

        var costLine = d3.line().curve(d3.curveMonotoneX)
            .x(function(d) { return xScale(d.year); })
            .y(function(d) { return costScale(d.cost); });

        var costAreaGen = d3.area().curve(d3.curveMonotoneX)
            .x(function(d) { return xScale(d.year); })
            .y0(costY + costH)
            .y1(function(d) { return costScale(d.cost); });

        // Cost gradient
        var costGrad = defs.append('linearGradient').attr('id', 'cost-grad')
            .attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
        costGrad.append('stop').attr('offset', '0%').attr('stop-color', '#c0392b').attr('stop-opacity', 0.3);
        costGrad.append('stop').attr('offset', '100%').attr('stop-color', '#c0392b').attr('stop-opacity', 0.02);

        // Baseline
        bandG.append('line').attr('x1', margin.left).attr('y1', costY + costH)
            .attr('x2', margin.left + plotW).attr('y2', costY + costH)
            .attr('stroke', '#475569').attr('stroke-width', 0.5);

        costAreaPath = bandG.append('path').datum(costData).attr('d', costAreaGen)
            .attr('fill', 'url(#cost-grad)').style('cursor', 'pointer');

        costLinePath = bandG.append('path').datum(costData).attr('d', costLine)
            .attr('fill', 'none').attr('stroke', '#c0392b').attr('stroke-width', 2.5)
            .style('cursor', 'pointer');

        // Cost chart hover
        costAreaPath.on('mouseenter', function() { highlightCost(true); })
                    .on('mouseleave', function() { highlightCost(false); });
        costLinePath.on('mouseenter', function() { highlightCost(true); })
                    .on('mouseleave', function() { highlightCost(false); });

        // Cost labels
        bandG.append('text').attr('x', margin.left - 8).attr('y', costY + 8)
            .attr('text-anchor', 'end').attr('font-size', '9px')
            .attr('fill', '#c0392b').attr('font-weight', 600).text('HIGH');
        bandG.append('text').attr('x', margin.left - 8).attr('y', costY + costH - 2)
            .attr('text-anchor', 'end').attr('font-size', '9px')
            .attr('fill', '#c0392b').attr('font-weight', 600).text('LOW');

        // Y-axis label
        bandG.append('text')
            .attr('transform', 'translate(' + (margin.left - 50) + ',' + (costY + costH / 2) + ') rotate(-90)')
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#c0392b').attr('font-weight', 600).text('SWITCHING COST');

        // Cliff annotation
        var cliffX = xScale(2023);
        bandG.append('line').attr('x1', cliffX).attr('y1', costScale(45) - 5)
            .attr('x2', cliffX).attr('y2', costY + costH)
            .attr('stroke', '#c0392b').attr('stroke-width', 1).attr('stroke-dasharray', '4,3').attr('stroke-opacity', 0.5);

        // ── X-AXIS (years) ──
        var axisY = H - margin.bottom + 10;
        bandG.append('line').attr('x1', margin.left).attr('y1', axisY)
            .attr('x2', margin.left + plotW).attr('y2', axisY)
            .attr('stroke', '#475569').attr('stroke-width', 1);

        [2003, 2006, 2010, 2014, 2018, 2022, 2024, 2026].forEach(function(yr) {
            bandG.append('text').attr('x', xScale(yr)).attr('y', axisY + 14)
                .attr('text-anchor', 'middle').attr('font-size', '10px')
                .attr('fill', '#475569').text(yr);
            bandG.append('line').attr('x1', xScale(yr)).attr('y1', axisY)
                .attr('x2', xScale(yr)).attr('y2', axisY + 4)
                .attr('stroke', '#475569').attr('stroke-width', 1);
        });

        // ── INTERACTIVE LEGEND (hover highlights corresponding region) ──
        var legItems = [
            { color: '#e67e22', label: 'PowerPoint dominance', hlFn: highlightPPT },
            { color: '#27ae60', label: 'Code-based alternatives', hlFn: highlightAlt },
            { color: '#c0392b', label: 'Switching cost', hlFn: highlightCost }
        ];
        var legX = W - margin.right - 200, legY = margin.top + 2;

        legItems.forEach(function(item, i) {
            var lg = svg.append('g').style('cursor', 'pointer');
            lg.append('rect').attr('x', legX - 4).attr('y', legY + i * 16 - 2)
                .attr('width', 200).attr('height', 15).attr('fill', 'transparent');
            lg.append('rect').attr('x', legX).attr('y', legY + i * 16)
                .attr('width', 10).attr('height', 10).attr('rx', 2)
                .attr('fill', item.color).attr('fill-opacity', 0.5);
            lg.append('text').attr('x', legX + 16).attr('y', legY + i * 16 + 9)
                .attr('font-size', '9px').attr('fill', '#475569').text(item.label);
            lg.on('mouseenter', function() { item.hlFn(true); })
              .on('mouseleave', function() { item.hlFn(false); });
        });

        // ── REVEAL ANIMATION: sweep right ──
        clipRect.transition().duration(3000).ease(d3.easeLinear)
            .attr('width', W);
    }


    // ─── GOVERNING PRINCIPLE: Bauhaus kinetic typography ─────
    function governingPrinciple(container, config) {
        var W = 1100, H = 500;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // ── Bauhaus palette ──
        var navy    = '#1B3A5C';
        var red     = '#C0392B';
        var gold    = '#D4A017';
        var slate   = '#475569';
        var bgWhite = '#FAFAF8';

        // Background: warm off-white with thin Bauhaus border
        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', bgWhite).attr('rx', 0);
        svg.append('rect').attr('x', 18).attr('y', 18)
            .attr('width', W - 36).attr('height', H - 36)
            .attr('fill', 'none').attr('stroke', navy).attr('stroke-width', 2);

        // ── Bauhaus geometric accents ──
        // Top-left red square
        svg.append('rect').attr('x', 18).attr('y', 18)
            .attr('width', 28).attr('height', 28)
            .attr('fill', red);
        // Bottom-right gold square
        svg.append('rect').attr('x', W - 46).attr('y', H - 46)
            .attr('width', 28).attr('height', 28)
            .attr('fill', gold);
        // Top-right navy circle
        svg.append('circle').attr('cx', W - 32).attr('cy', 32)
            .attr('r', 14).attr('fill', navy);

        // ── SLOGAN: Bauhaus typography, appears in two beats ──
        var sloganG = svg.append('g');
        var cx = W / 2, cy = H * 0.38;

        // Line 1: "Automate what you do"
        var line1 = sloganG.append('text').attr('x', cx).attr('y', cy)
            .attr('text-anchor', 'middle')
            .attr('font-size', '48px').attr('font-weight', 800)
            .attr('fill', navy).attr('letter-spacing', '-1px')
            .style('font-family', 'Inter, Helvetica Neue, Arial, sans-serif')
            .style('opacity', 0)
            .text('Automate what you do,');

        // Line 2: "not do what is automated."
        var line2 = sloganG.append('text').attr('x', cx).attr('y', cy + 60)
            .attr('text-anchor', 'middle')
            .attr('font-size', '48px').attr('font-weight', 300)
            .attr('fill', slate).attr('letter-spacing', '-1px')
            .style('font-family', 'Inter, Helvetica Neue, Arial, sans-serif')
            .style('opacity', 0)
            .text('not do what is automated.');

        // Underline accent
        var underline = sloganG.append('line')
            .attr('x1', cx - 200).attr('y1', cy + 78)
            .attr('x2', cx - 200).attr('y2', cy + 78)
            .attr('stroke', red).attr('stroke-width', 3);

        // Beat 1: line 1 appears
        line1.transition().delay(300).duration(700)
            .style('opacity', 1);
        // Beat 2: line 2 appears
        line2.transition().delay(900).duration(700)
            .style('opacity', 1);
        // Beat 3: underline sweeps
        underline.transition().delay(1600).duration(600)
            .attr('x2', cx + 200);

        // ── ANIMATED NAV ARROWS: illustrate "you go left, you go right" ──
        var arrowY = H * 0.38;
        var arrowSize = 40;

        // Left chevron «
        var leftArrow = svg.append('g').style('opacity', 0);
        leftArrow.append('path')
            .attr('d', 'M' + (60 + arrowSize) + ',' + (arrowY - arrowSize) +
                        ' L60,' + arrowY +
                        ' L' + (60 + arrowSize) + ',' + (arrowY + arrowSize))
            .attr('fill', 'none').attr('stroke', red).attr('stroke-width', 4)
            .attr('stroke-linecap', 'round').attr('stroke-linejoin', 'round');
        leftArrow.append('text').attr('x', 62).attr('y', arrowY + arrowSize + 30)
            .attr('text-anchor', 'start').attr('font-size', '11px')
            .attr('fill', red).attr('font-weight', 600).attr('letter-spacing', '2px')
            .text('← PREV');

        // Right chevron »
        var rightArrow = svg.append('g').style('opacity', 0);
        rightArrow.append('path')
            .attr('d', 'M' + (W - 60 - arrowSize) + ',' + (arrowY - arrowSize) +
                        ' L' + (W - 60) + ',' + arrowY +
                        ' L' + (W - 60 - arrowSize) + ',' + (arrowY + arrowSize))
            .attr('fill', 'none').attr('stroke', navy).attr('stroke-width', 4)
            .attr('stroke-linecap', 'round').attr('stroke-linejoin', 'round');
        rightArrow.append('text').attr('x', W - 62).attr('y', arrowY + arrowSize + 30)
            .attr('text-anchor', 'end').attr('font-size', '11px')
            .attr('fill', navy).attr('font-weight', 600).attr('letter-spacing', '2px')
            .text('NEXT →');

        // Arrow animation: sweep in → hold → fade out → repeat
        function animateArrows() {
            // Left arrow sweeps in from off-screen
            leftArrow.attr('transform', 'translate(-80,0)').style('opacity', 0);
            leftArrow.transition().delay(2400).duration(500)
                .attr('transform', 'translate(0,0)').style('opacity', 0.9)
              .transition().duration(1200) // hold
              .transition().duration(500).style('opacity', 0);

            // Right arrow sweeps in from off-screen
            rightArrow.attr('transform', 'translate(80,0)').style('opacity', 0);
            rightArrow.transition().delay(2700).duration(500)
                .attr('transform', 'translate(0,0)').style('opacity', 0.9)
              .transition().duration(1200) // hold
              .transition().duration(500).style('opacity', 0);

            // "This is what you automate" label appears between the arrows
            autoLabel
                .style('opacity', 0)
                .transition().delay(3400).duration(400).style('opacity', 1)
                .transition().delay(1500).duration(600).style('opacity', 0);

            // Bottom nav bar highlights
            navHighlight
                .style('opacity', 0)
                .transition().delay(3800).duration(400).style('opacity', 1)
                .transition().delay(1200).duration(600).style('opacity', 0);

            // Repeat cycle
            setTimeout(animateArrows, 8000);
        }

        // ── "This is what you automate" annotation ──
        var autoLabel = svg.append('text')
            .attr('x', cx).attr('y', H * 0.62)
            .attr('text-anchor', 'middle')
            .attr('font-size', '15px').attr('font-weight', 600)
            .attr('fill', red).style('opacity', 0)
            .attr('letter-spacing', '3px')
            .text('THIS IS WHAT YOU AUTOMATE');

        // ── BOTTOM NAV BAR: represents slide navigation ──
        var navY = H - 70;
        var navW = 500, navH = 28;
        var navX = (W - navW) / 2;

        var navG = svg.append('g');

        // Nav bar background
        navG.append('rect').attr('x', navX).attr('y', navY)
            .attr('width', navW).attr('height', navH).attr('rx', 14)
            .attr('fill', '#e2e8f0');

        // Nav dots (representing slides)
        var dotCount = 15;
        var dotSpacing = navW / (dotCount + 1);
        for (var di = 0; di < dotCount; di++) {
            var dx = navX + dotSpacing * (di + 1);
            navG.append('circle').attr('cx', dx).attr('cy', navY + navH / 2)
                .attr('r', 4)
                .attr('fill', di === 3 ? navy : '#94a3b8');
        }

        // Nav label
        navG.append('text').attr('x', cx).attr('y', navY + navH + 18)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', slate).attr('letter-spacing', '1px')
            .text('SLIDE NAVIGATION');

        // Nav highlight ring (animated)
        var navHighlight = svg.append('rect')
            .attr('x', navX - 6).attr('y', navY - 6)
            .attr('width', navW + 12).attr('height', navH + 12).attr('rx', 18)
            .attr('fill', 'none').attr('stroke', gold).attr('stroke-width', 3)
            .style('opacity', 0);

        // ── Bauhaus rule line at bottom ──
        svg.append('line').attr('x1', 18).attr('y1', H - 30)
            .attr('x2', W - 18).attr('y2', H - 30)
            .attr('stroke', navy).attr('stroke-width', 1).attr('stroke-opacity', 0.3);

        // ── Subtitle line ──
        svg.append('text').attr('x', cx).attr('y', H - 12)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', slate).attr('font-style', 'italic');

        // Start the arrow animation loop
        animateArrows();
    }


    // ─── ARCHITECTURAL JUDGMENT (scaling fork) ─────────────────
    function architecturalJudgment(container, config) {
        var W = 1050, H = 560;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Transparent bg for test harness
        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', 'white').attr('fill-opacity', 0);

        var cx = W / 2;

        // ── Colors ──
        var green = '#065f46';
        var greenLight = '#ecfdf5';
        var red = '#991b1b';
        var redLight = '#fef2f2';
        var slate = '#374151';
        var darkText = '#1f2937';

        // ── Geometry: Y-fork from bottom center ──
        var stemBaseY = H - 70;
        var forkY = 340;
        var stemW = 64;

        // Left branch (precise intent) — stays narrow
        var leftEndX = cx - 260;
        var leftEndY = 100;
        var leftW = 56;

        // Right branch (vague intent) — widens dramatically
        var rightEndX = cx + 260;
        var rightEndY = 100;
        var rightWEnd = 200;

        // ── Top annotation ──
        svg.append('text')
            .attr('x', cx).attr('y', 28)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#6b7280').attr('letter-spacing', '1.5px')
            .text('PRECISION OF THOUGHT');

        // ── Draw stem (layer 1 — back) ──
        svg.append('polygon')
            .attr('points',
                (cx - stemW / 2) + ',' + stemBaseY + ' ' +
                (cx + stemW / 2) + ',' + stemBaseY + ' ' +
                (cx + stemW / 2) + ',' + forkY + ' ' +
                (cx - stemW / 2) + ',' + forkY)
            .attr('fill', '#e5e7eb').attr('stroke', slate)
            .attr('stroke-width', 1.5);

        // ── LEFT BRANCH (layer 2) ──
        var lx1 = cx - stemW / 2;
        var lx2 = cx - 4;
        svg.append('polygon')
            .attr('points',
                lx1 + ',' + forkY + ' ' +
                lx2 + ',' + forkY + ' ' +
                (leftEndX + leftW / 2) + ',' + leftEndY + ' ' +
                (leftEndX - leftW / 2) + ',' + leftEndY)
            .attr('fill', greenLight)
            .attr('stroke', green).attr('stroke-width', 1.5);

        // ── RIGHT BRANCH (layer 2) ──
        var rx1 = cx + 4;
        var rx2 = cx + stemW / 2;
        svg.append('polygon')
            .attr('points',
                rx1 + ',' + forkY + ' ' +
                rx2 + ',' + forkY + ' ' +
                (rightEndX + rightWEnd / 2) + ',' + rightEndY + ' ' +
                (rightEndX - rightWEnd / 2) + ',' + rightEndY)
            .attr('fill', redLight)
            .attr('stroke', red).attr('stroke-width', 1.5);

        // ══════ ALL LABELS DRAWN LAST (layer 3 — on top) ══════

        // ── Stem label ──
        svg.append('text')
            .attr('x', cx).attr('y', stemBaseY + 24)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('font-weight', '700').attr('fill', darkText)
            .text('AI-Accelerated Implementation');

        svg.append('text')
            .attr('x', cx).attr('y', stemBaseY + 42)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#4b5563').attr('font-style', 'italic')
            .text('Same speed. Same power. Either path.');

        // ── Fork point (drawn ON TOP of branches) ──
        // White backing to clear the overlapping branch edges
        svg.append('circle')
            .attr('cx', cx).attr('cy', forkY)
            .attr('r', 18)
            .attr('fill', 'white');

        svg.append('circle')
            .attr('cx', cx).attr('cy', forkY)
            .attr('r', 16)
            .attr('fill', '#f3f4f6')
            .attr('stroke', slate).attr('stroke-width', 2);

        // "DECISION POINT" inside the circle area, clearly visible
        svg.append('text')
            .attr('x', cx).attr('y', forkY - 24)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('font-weight', '700').attr('fill', darkText)
            .attr('letter-spacing', '1.5px');

        // Arrow-down hint inside circle
        svg.append('text')
            .attr('x', cx).attr('y', forkY + 5)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('font-weight', '700').attr('fill', slate)
            .text('\u25B2'); // upward triangle (fork goes up)

        // ── Left branch labels ──
        svg.append('text')
            .attr('x', leftEndX).attr('y', leftEndY - 20)
            .attr('text-anchor', 'middle').attr('font-size', '16px')
            .attr('font-weight', '700').attr('fill', green)
            .text('Clear Intent');

        // Annotations along left branch — positioned outside the shape
        var leftAnnotX = leftEndX - leftW / 2 - 16;
        var leftMidY = (forkY + leftEndY) / 2 - 10;

        svg.append('text')
            .attr('x', leftAnnotX).attr('y', leftMidY - 20)
            .attr('text-anchor', 'end').attr('font-size', '12px')
            .attr('fill', green).attr('font-weight', '600')
            .text('Right abstraction');
        svg.append('text')
            .attr('x', leftAnnotX).attr('y', leftMidY)
            .attr('text-anchor', 'end').attr('font-size', '12px')
            .attr('fill', green).attr('font-weight', '600')
            .text('Right data model');
        svg.append('text')
            .attr('x', leftAnnotX).attr('y', leftMidY + 20)
            .attr('text-anchor', 'end').attr('font-size', '12px')
            .attr('fill', green).attr('font-weight', '600')
            .text('Right decomposition');

        // Left outcome
        svg.append('rect')
            .attr('x', leftEndX - 90).attr('y', leftEndY - 8)
            .attr('width', 180).attr('height', 3)
            .attr('fill', green).attr('fill-opacity', 0.3);

        svg.append('text')
            .attr('x', leftEndX).attr('y', leftEndY + 18)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', green).attr('font-weight', '600');

        // ── Right branch labels ──
        svg.append('text')
            .attr('x', rightEndX).attr('y', rightEndY - 20)
            .attr('text-anchor', 'middle').attr('font-size', '16px')
            .attr('font-weight', '700').attr('fill', red)
            .text('Vague Intent');

        // Annotations along right branch — positioned outside the shape
        var rightAnnotX = rightEndX + rightWEnd / 2 + 16;
        var rightMidY = (forkY + rightEndY) / 2 - 10;

        svg.append('text')
            .attr('x', rightAnnotX).attr('y', rightMidY - 20)
            .attr('font-size', '12px')
            .attr('fill', red).attr('font-weight', '600')
            .text('Working code');
        svg.append('text')
            .attr('x', rightAnnotX).attr('y', rightMidY)
            .attr('font-size', '12px')
            .attr('fill', red).attr('font-weight', '600')
            .text('Wrong system');
        svg.append('text')
            .attr('x', rightAnnotX).attr('y', rightMidY + 20)
            .attr('font-size', '12px')
            .attr('fill', red).attr('font-weight', '600')
            .text('Scaled cost');

        // Width annotation on right branch
        var annY = rightEndY + 8;
        svg.append('line')
            .attr('x1', rightEndX - rightWEnd / 2)
            .attr('y1', annY)
            .attr('x2', rightEndX + rightWEnd / 2)
            .attr('y2', annY)
            .attr('stroke', red).attr('stroke-width', 1)
            .attr('stroke-opacity', 0.5);

        svg.append('text')
            .attr('x', rightEndX).attr('y', annY + 18)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', red).attr('font-weight', '600')
            .text('Cost expands');

        // Width comparison on left branch
        svg.append('line')
            .attr('x1', leftEndX - leftW / 2).attr('y1', leftEndY + 8)
            .attr('x2', leftEndX + leftW / 2).attr('y2', leftEndY + 8)
            .attr('stroke', green).attr('stroke-width', 1)
            .attr('stroke-opacity', 0.5);

        // ── Center insight (between fork and stem) ──
        svg.append('text')
            .attr('x', cx).attr('y', forkY + 46)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', darkText).attr('font-style', 'italic');

        // ── Bauhaus bottom rule ──
        svg.append('line')
            .attr('x1', 40).attr('y1', H - 4)
            .attr('x2', W - 40).attr('y2', H - 4)
            .attr('stroke', darkText).attr('stroke-width', 1).attr('stroke-opacity', 0.12);
    }


    // ─── TACIT KNOWLEDGE (transfer boundary) ───────────────────
    function tacitKnowledge(container, config) {
        var W = 1050, H = 560;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Transparent bg for test harness
        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', 'white').attr('fill-opacity', 0);

        var darkText = '#1f2937';

        // ── Layout ──
        var leftMargin = 50;
        var zoneW = 720;
        var boundaryY = 260;
        var topZoneY = 56;
        var botZoneY = boundaryY + 4;
        var botZoneH = 210;
        var topZoneH = boundaryY - topZoneY - 4;

        // Expert bridge on the right
        var bridgeX = leftMargin + zoneW + 50;
        var bridgeW = 170;

        // ── Top zone background (codified — AI accessible) ──
        svg.append('rect')
            .attr('x', leftMargin).attr('y', topZoneY)
            .attr('width', zoneW).attr('height', topZoneH)
            .attr('rx', 4)
            .attr('fill', '#ecfdf5')
            .attr('stroke', '#065f46').attr('stroke-width', 1)
            .attr('stroke-opacity', 0.25);

        // Top zone header
        svg.append('text')
            .attr('x', leftMargin + 16).attr('y', topZoneY + 26)
            .attr('font-size', '15px').attr('font-weight', '700')
            .attr('fill', '#065f46').attr('letter-spacing', '1px')
            .text('CODIFIED KNOWLEDGE');

        svg.append('text')
            .attr('x', leftMargin + 16).attr('y', topZoneY + 46)
            .attr('font-size', '13px')
            .attr('fill', '#065f46')
            .text('AI can use this');

        // Codified items
        var codified = [
            { label: 'Rules & Policies', x: 100, y: 100 },
            { label: 'Dictionaries & Ontologies', x: 360, y: 90 },
            { label: 'Interface Specifications', x: 140, y: 160 },
            { label: 'Historical Examples', x: 420, y: 155 },
            { label: 'Documentation', x: 600, y: 110 },
            { label: 'Code & APIs', x: 580, y: 170 }
        ];

        codified.forEach(function (item) {
            // Dot
            svg.append('circle')
                .attr('cx', leftMargin + item.x).attr('cy', topZoneY + item.y - 30)
                .attr('r', 5)
                .attr('fill', '#065f46').attr('fill-opacity', 0.7);
            // Label
            svg.append('text')
                .attr('x', leftMargin + item.x + 12)
                .attr('y', topZoneY + item.y - 25)
                .attr('font-size', '14px').attr('font-weight', '600')
                .attr('fill', '#1f2937')
                .text(item.label);
        });

        // ── Bottom zone background (tacit — AI inaccessible) ──
        // Drawn BEFORE boundary so boundary renders on top
        svg.append('rect')
            .attr('x', leftMargin).attr('y', botZoneY)
            .attr('width', zoneW).attr('height', botZoneH)
            .attr('rx', 4)
            .attr('fill', '#fef2f2')
            .attr('stroke', '#991b1b').attr('stroke-width', 1)
            .attr('stroke-opacity', 0.25);

        // Bottom zone header
        svg.append('text')
            .attr('x', leftMargin + 16).attr('y', botZoneY + 26)
            .attr('font-size', '15px').attr('font-weight', '700')
            .attr('fill', '#991b1b').attr('letter-spacing', '1px')
            .text('TACIT KNOWLEDGE');

        svg.append('text')
            .attr('x', leftMargin + 16).attr('y', botZoneY + 46)
            .attr('font-size', '13px')
            .attr('fill', '#991b1b')
            .text('AI cannot inherit this');

        // Tacit items
        var tacit = [
            { label: 'Lived experience', x: 100, y: 80 },
            { label: 'Tacit judgment', x: 360, y: 72 },
            { label: 'Local workflow reality', x: 140, y: 140 },
            { label: 'Institutional memory', x: 420, y: 135 },
            { label: 'Which ambiguity is dangerous', x: 240, y: 180 },
            { label: 'When correct is wrong', x: 550, y: 100 }
        ];

        tacit.forEach(function (item) {
            // Hollow dot (tacit = not capturable)
            svg.append('circle')
                .attr('cx', leftMargin + item.x).attr('cy', botZoneY + item.y - 20)
                .attr('r', 5)
                .attr('fill', 'none')
                .attr('stroke', '#991b1b').attr('stroke-width', 2.5);
            // Label
            svg.append('text')
                .attr('x', leftMargin + item.x + 12)
                .attr('y', botZoneY + item.y - 15)
                .attr('font-size', '14px').attr('font-weight', '600')
                .attr('fill', '#1f2937')
                .text(item.label);
        });

        // ── TRANSFER BOUNDARY LINE (drawn after both zones so it's on top) ──
        svg.append('line')
            .attr('x1', leftMargin - 10).attr('y1', boundaryY)
            .attr('x2', leftMargin + zoneW + 10).attr('y2', boundaryY)
            .attr('stroke', '#dc2626').attr('stroke-width', 3);

        // Boundary label — white backing with generous padding
        var boundaryLabelX = leftMargin + zoneW / 2;
        svg.append('rect')
            .attr('x', boundaryLabelX - 130).attr('y', boundaryY - 16)
            .attr('width', 260).attr('height', 32)
            .attr('rx', 4).attr('fill', 'white')
            .attr('stroke', '#dc2626').attr('stroke-width', 1).attr('stroke-opacity', 0.3);

        svg.append('text')
            .attr('x', boundaryLabelX).attr('y', boundaryY + 8)
            .attr('text-anchor', 'middle').attr('font-size', '16px')
            .attr('font-weight', '700').attr('fill', '#dc2626')
            .attr('letter-spacing', '2.5px')
            .text('TRANSFER BOUNDARY');

        // ── EXPERT BRIDGE (right side, spanning both zones) ──
        var bridgeTop = topZoneY + 20;
        var bridgeBot = botZoneY + botZoneH - 20;
        var bridgeCx = bridgeX + bridgeW / 2;

        // Vertical bridge rect
        svg.append('rect')
            .attr('x', bridgeX).attr('y', bridgeTop)
            .attr('width', bridgeW).attr('height', bridgeBot - bridgeTop)
            .attr('rx', 4)
            .attr('fill', '#eff6ff')
            .attr('stroke', '#1e3a5f').attr('stroke-width', 2);

        // Bridge header
        svg.append('text')
            .attr('x', bridgeCx).attr('y', bridgeTop + 28)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('font-weight', '700').attr('fill', '#1e3a5f')
            .attr('letter-spacing', '1.5px')
            .text('THE EXPERT');

        // Bridge subtitle
        svg.append('text')
            .attr('x', bridgeCx).attr('y', bridgeTop + 46)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#4b5563').attr('font-style', 'italic')
            .text('spans both zones');

        // Divider inside bridge
        svg.append('line')
            .attr('x1', bridgeX + 16).attr('y1', bridgeTop + 58)
            .attr('x2', bridgeX + bridgeW - 16).attr('y2', bridgeTop + 58)
            .attr('stroke', '#1e3a5f').attr('stroke-width', 1).attr('stroke-opacity', 0.2);

        // Expert roles
        var roles = [
            { label: 'Formalize', desc: 'what can be codified', y: bridgeTop + 86 },
            { label: 'Supervise', desc: 'what AI produces', y: bridgeTop + 140 },
            { label: 'Interpret', desc: 'what context demands', y: bridgeTop + 194 }
        ];

        roles.forEach(function (role) {
            svg.append('text')
                .attr('x', bridgeCx).attr('y', role.y)
                .attr('text-anchor', 'middle').attr('font-size', '16px')
                .attr('font-weight', '700').attr('fill', '#1e3a5f')
                .text(role.label);

            svg.append('text')
                .attr('x', bridgeCx).attr('y', role.y + 20)
                .attr('text-anchor', 'middle').attr('font-size', '12px')
                .attr('fill', '#374151')
                .text(role.desc);
        });

        // Arrows from bridge into both zones
        // Arrow into top zone
        svg.append('line')
            .attr('x1', bridgeX).attr('y1', bridgeTop + 80)
            .attr('x2', leftMargin + zoneW + 6).attr('y2', bridgeTop + 80)
            .attr('stroke', '#1e3a5f').attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '4,3');

        // Arrow into bottom zone
        svg.append('line')
            .attr('x1', bridgeX).attr('y1', botZoneY + 80)
            .attr('x2', leftMargin + zoneW + 6).attr('y2', botZoneY + 80)
            .attr('stroke', '#1e3a5f').attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '4,3');

        // ── Top title ──
        svg.append('text')
            .attr('x', W / 2).attr('y', 30)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#374151').attr('font-weight', '700')
            .attr('letter-spacing', '2px')
            .text('TACIT KNOWLEDGE DOES NOT TRANSFER CLEANLY');

        // ── Bottom takeaway ──
        svg.append('text')
            .attr('x', W / 2).attr('y', H - 28)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('fill', darkText).attr('font-style', 'italic')
            .text('AI amplifies expertise.');

        svg.append('text')
            .attr('x', W / 2).attr('y', H - 8)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('fill', darkText).attr('font-weight', '700')
            .text('The gap is qualitative.');

        // ── Bauhaus bottom rule ──
        svg.append('line')
            .attr('x1', 40).attr('y1', H - 4)
            .attr('x2', W - 40).attr('y2', H - 4)
            .attr('stroke', darkText).attr('stroke-width', 1).attr('stroke-opacity', 0.12);
    }


    // ─── WRONG QUESTION (typographic pivot) ────────────────────
    function wrongQuestion(container, config) {
        var W = 1050, H = 560;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', 'white').attr('fill-opacity', 0);

        var cx = W / 2;
        var darkText = '#1f2937';

        // ══════════════════════════════════════════════
        // UPPER ZONE — The wrong question (faded, struck)
        // ══════════════════════════════════════════════

        // Subtle background tint for wrong-question zone
        svg.append('rect')
            .attr('x', 60).attr('y', 30)
            .attr('width', W - 120).attr('height', 160)
            .attr('rx', 4)
            .attr('fill', '#fef2f2');

        // "Most conversations about AI ask:"
        svg.append('text')
            .attr('x', cx).attr('y', 72)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('fill', '#6b7280')
            .text('Most conversations about AI-assisted development ask:');

        // The wrong question — large, struck through
        var wrongY = 128;
        svg.append('text')
            .attr('x', cx).attr('y', wrongY)
            .attr('text-anchor', 'middle').attr('font-size', '32px')
            .attr('font-weight', '300').attr('fill', '#991b1b')
            .attr('fill-opacity', 0.4)
            .attr('font-style', 'italic')
            .text('\u201CWhat can AI build?\u201D');

        // Strikethrough line across the wrong question
        var strikeW = 360;
        svg.append('line')
            .attr('x1', cx - strikeW / 2).attr('y1', wrongY - 8)
            .attr('x2', cx + strikeW / 2).attr('y2', wrongY - 8)
            .attr('stroke', '#991b1b').attr('stroke-width', 2.5)
            .attr('stroke-opacity', 0.5);

        // "That is the wrong question." label
        svg.append('text')
            .attr('x', cx).attr('y', 170)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('font-weight', '600').attr('fill', '#991b1b')
            .attr('letter-spacing', '2px')
            .text('THAT IS THE WRONG QUESTION');

        // ══════════════════════════════════════════════
        // GEOMETRIC PIVOT — Bauhaus divider
        // ══════════════════════════════════════════════

        var pivotY = 214;

        // Horizontal rule
        svg.append('line')
            .attr('x1', 100).attr('y1', pivotY)
            .attr('x2', cx - 18).attr('y2', pivotY)
            .attr('stroke', darkText).attr('stroke-width', 2).attr('stroke-opacity', 0.3);

        svg.append('line')
            .attr('x1', cx + 18).attr('y1', pivotY)
            .attr('x2', W - 100).attr('y2', pivotY)
            .attr('stroke', darkText).attr('stroke-width', 2).attr('stroke-opacity', 0.3);

        // Central diamond pivot marker
        svg.append('rect')
            .attr('x', cx - 8).attr('y', pivotY - 8)
            .attr('width', 16).attr('height', 16)
            .attr('fill', darkText)
            .attr('transform', 'rotate(45,' + cx + ',' + pivotY + ')');

        // ══════════════════════════════════════════════
        // LOWER ZONE — The right question (bold, present)
        // ══════════════════════════════════════════════

        // Subtle background tint for right-question zone
        svg.append('rect')
            .attr('x', 60).attr('y', 240)
            .attr('width', W - 120).attr('height', 130)
            .attr('rx', 4)
            .attr('fill', '#ecfdf5');

        // "The useful question:"
        svg.append('text')
            .attr('x', cx).attr('y', 274)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('fill', '#065f46')
            .text('The useful question:');

        // The right question — large, bold, full weight
        svg.append('text')
            .attr('x', cx).attr('y', 324)
            .attr('text-anchor', 'middle').attr('font-size', '28px')
            .attr('font-weight', '700').attr('fill', '#065f46')
            .text('\u201CWhat does AI change about the act of building?\u201D');

        // Underline emphasis
        var underW = 560;
        svg.append('line')
            .attr('x1', cx - underW / 2).attr('y1', 336)
            .attr('x2', cx + underW / 2).attr('y2', 336)
            .attr('stroke', '#065f46').attr('stroke-width', 2)
            .attr('stroke-opacity', 0.25);

        // ══════════════════════════════════════════════
        // TAKEAWAY — anchoring the bottom
        // ══════════════════════════════════════════════

        // Divider
        svg.append('line')
            .attr('x1', 160).attr('y1', 400)
            .attr('x2', W - 160).attr('y2', 400)
            .attr('stroke', darkText).attr('stroke-width', 1).attr('stroke-opacity', 0.15);

        // Takeaway
        svg.append('text')
            .attr('x', cx).attr('y', 436)
            .attr('text-anchor', 'middle').attr('font-size', '15px')
            .attr('fill', darkText).attr('font-weight', '600')
            .text('The capability is not the transformation.');

        svg.append('text')
            .attr('x', cx).attr('y', 460)
            .attr('text-anchor', 'middle').attr('font-size', '15px')
            .attr('fill', darkText).attr('font-weight', '600')
            .text('The transformation is what changes in the practice of building.');

        // Comment / expanded blob
        svg.append('text')
            .attr('x', cx).attr('y', 500)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#6b7280').attr('font-style', 'italic')
            .text('Let\u2019s try to recalibrate our thinking about the role of AI in development.');

        // ── Bauhaus bottom rule ──
        svg.append('line')
            .attr('x1', 40).attr('y1', H - 4)
            .attr('x2', W - 40).attr('y2', H - 4)
            .attr('stroke', darkText).attr('stroke-width', 1).attr('stroke-opacity', 0.12);
    }


    // ─── SYLLABIC MIXING (cross-domain discovery) ─────────────
    function syllabicMixing(container, config) {
        var W = 1050, H = 560;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', 'white').attr('fill-opacity', 0);

        var darkText = '#1f2937';
        var cx = W / 2;

        // ── Top title ──
        svg.append('text')
            .attr('x', cx).attr('y', 26)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#374151').attr('font-weight', '700')
            .attr('letter-spacing', '2px')
            .text('SYLLABIC MIXING \u2014 AI AS CROSS-DOMAIN CONSULTANT');

        // ── Seven language sources ──
        var languages = [
            { name: 'Finnish', rule: 'Vowel harmony', color: '#1e3a5f' },
            { name: 'Georgian', rule: 'Consonant clusters', color: '#5b21b6' },
            { name: 'Yoruba', rule: 'Tonal patterns', color: '#065f46' },
            { name: 'Japanese', rule: 'CV syllables', color: '#991b1b' },
            { name: 'Welsh', rule: 'Mutation rules', color: '#92400e' },
            { name: 'Swahili', rule: 'Agglutination', color: '#0e7490' },
            { name: 'Hungarian', rule: 'Stress patterns', color: '#7c3aed' }
        ];

        var blockW = 110, blockH = 70;
        var langGap = 18;
        var totalLangW = languages.length * blockW + (languages.length - 1) * langGap;
        var langStartX = (W - totalLangW) / 2;
        var langY = 50;

        languages.forEach(function (lang, i) {
            var bx = langStartX + i * (blockW + langGap);
            var bCx = bx + blockW / 2;

            // Block
            svg.append('rect')
                .attr('x', bx).attr('y', langY)
                .attr('width', blockW).attr('height', blockH)
                .attr('rx', 3)
                .attr('fill', lang.color).attr('fill-opacity', 0.08)
                .attr('stroke', lang.color).attr('stroke-width', 1.5);

            // Top color accent bar
            svg.append('rect')
                .attr('x', bx).attr('y', langY)
                .attr('width', blockW).attr('height', 4)
                .attr('rx', 2).attr('fill', lang.color);
            svg.append('rect')
                .attr('x', bx).attr('y', langY + 2)
                .attr('width', blockW).attr('height', 2)
                .attr('fill', lang.color);

            // Language name
            svg.append('text')
                .attr('x', bCx).attr('y', langY + 30)
                .attr('text-anchor', 'middle').attr('font-size', '13px')
                .attr('font-weight', '700').attr('fill', lang.color)
                .text(lang.name);

            // Rule
            svg.append('text')
                .attr('x', bCx).attr('y', langY + 48)
                .attr('text-anchor', 'middle').attr('font-size', '10px')
                .attr('fill', '#4b5563')
                .text(lang.rule);

            // Convergence line down to mixing zone
            svg.append('line')
                .attr('x1', bCx).attr('y1', langY + blockH)
                .attr('x2', cx).attr('y2', 200)
                .attr('stroke', lang.color).attr('stroke-width', 1.5)
                .attr('stroke-opacity', 0.3)
                .attr('stroke-dasharray', '4,3');
        });

        // ── Mixing zone (central) ──
        var mixY = 190, mixH = 70, mixW = 360;
        var mixX = cx - mixW / 2;

        svg.append('rect')
            .attr('x', mixX).attr('y', mixY)
            .attr('width', mixW).attr('height', mixH)
            .attr('rx', 6)
            .attr('fill', '#f8fafc')
            .attr('stroke', '#374151').attr('stroke-width', 2);

        svg.append('text')
            .attr('x', cx).attr('y', mixY + 28)
            .attr('text-anchor', 'middle').attr('font-size', '15px')
            .attr('font-weight', '700').attr('fill', darkText)
            .text('Syllabic Mixing Engine');

        svg.append('text')
            .attr('x', cx).attr('y', mixY + 48)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#4b5563')
            .text('Combine phonemic blocks according to each language\u2019s rules');

        // ── Arrow down from mixing zone ──
        var arrowTopY = mixY + mixH + 6;
        var arrowBotY = arrowTopY + 30;
        svg.append('line')
            .attr('x1', cx).attr('y1', arrowTopY)
            .attr('x2', cx).attr('y2', arrowBotY)
            .attr('stroke', '#374151').attr('stroke-width', 2);
        svg.append('polygon')
            .attr('points',
                cx + ',' + (arrowBotY + 2) + ' ' +
                (cx - 5) + ',' + (arrowBotY - 6) + ' ' +
                (cx + 5) + ',' + (arrowBotY - 6))
            .attr('fill', '#374151');

        // ── Two-axis outcome diagram ──
        var chartX = 160, chartY = 310, chartW = 340, chartH = 180;

        // Background
        svg.append('rect')
            .attr('x', chartX).attr('y', chartY)
            .attr('width', chartW).attr('height', chartH)
            .attr('fill', '#f9fafb')
            .attr('stroke', '#e5e7eb').attr('stroke-width', 1);

        // Quadrant shading — top-left is the sweet spot
        svg.append('rect')
            .attr('x', chartX).attr('y', chartY)
            .attr('width', chartW / 2).attr('height', chartH / 2)
            .attr('fill', '#065f46').attr('fill-opacity', 0.06);

        // Y-axis: "Is a real name" (bottom=low, top=high)
        svg.append('line')
            .attr('x1', chartX).attr('y1', chartY)
            .attr('x2', chartX).attr('y2', chartY + chartH)
            .attr('stroke', '#374151').attr('stroke-width', 1.5);

        svg.append('text')
            .attr('x', chartX - 10).attr('y', chartY + 8)
            .attr('text-anchor', 'end').attr('font-size', '11px')
            .attr('fill', '#374151').attr('font-weight', '600')
            .text('High');
        svg.append('text')
            .attr('x', chartX - 10).attr('y', chartY + chartH)
            .attr('text-anchor', 'end').attr('font-size', '11px')
            .attr('fill', '#374151').attr('font-weight', '600')
            .text('Low');

        // Y-axis label (rotated)
        svg.append('text')
            .attr('x', chartX - 42).attr('y', chartY + chartH / 2)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#374151').attr('font-weight', '600')
            .attr('transform', 'rotate(-90,' + (chartX - 42) + ',' + (chartY + chartH / 2) + ')')
            .text('Sounds like a name');

        // X-axis: "Sounds like a name" (left=low, right=high)
        svg.append('line')
            .attr('x1', chartX).attr('y1', chartY + chartH)
            .attr('x2', chartX + chartW).attr('y2', chartY + chartH)
            .attr('stroke', '#374151').attr('stroke-width', 1.5);

        svg.append('text')
            .attr('x', chartX).attr('y', chartY + chartH + 18)
            .attr('font-size', '11px')
            .attr('fill', '#374151').attr('font-weight', '600')
            .text('Low');
        svg.append('text')
            .attr('x', chartX + chartW).attr('y', chartY + chartH + 18)
            .attr('text-anchor', 'end').attr('font-size', '11px')
            .attr('fill', '#374151').attr('font-weight', '600')
            .text('High');

        // X-axis label
        svg.append('text')
            .attr('x', chartX + chartW / 2).attr('y', chartY + chartH + 34)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#374151').attr('font-weight', '600')
            .text('Is a real name');

        // ── Data point: syllabic mixing output (top-left sweet spot) ──
        var dotX = chartX + chartW * 0.18;
        var dotY = chartY + chartH * 0.15;

        svg.append('circle')
            .attr('cx', dotX).attr('cy', dotY).attr('r', 10)
            .attr('fill', '#065f46').attr('fill-opacity', 0.2)
            .attr('stroke', '#065f46').attr('stroke-width', 2.5);

        svg.append('text')
            .attr('x', dotX + 18).attr('y', dotY + 4)
            .attr('font-size', '13px').attr('font-weight', '700')
            .attr('fill', '#065f46')
            .text('Syllabic mixing output');

        svg.append('text')
            .attr('x', dotX + 18).attr('y', dotY + 20)
            .attr('font-size', '11px')
            .attr('fill', '#4b5563').attr('font-style', 'italic')
            .text('Sounds real, isn\u2019t real');

        // ── Quadrant labels ──
        svg.append('text')
            .attr('x', chartX + chartW * 0.75).attr('y', chartY + chartH * 0.2)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#6b7280')
            .text('Real names');

        svg.append('text')
            .attr('x', chartX + chartW * 0.75).attr('y', chartY + chartH * 0.8)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#6b7280')
            .text('Random strings');

        // ── Right side: cross-domain insight panel ──
        var panelX = 580, panelY = 310, panelW = 420, panelH = 180;

        svg.append('rect')
            .attr('x', panelX).attr('y', panelY)
            .attr('width', panelW).attr('height', panelH)
            .attr('rx', 4)
            .attr('fill', '#eff6ff')
            .attr('stroke', '#1e3a5f').attr('stroke-width', 1.5);

        // Panel header
        svg.append('text')
            .attr('x', panelX + panelW / 2).attr('y', panelY + 26)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('font-weight', '700').attr('fill', '#1e3a5f')
            .attr('letter-spacing', '1px')
            .text('THE CROSS-DOMAIN MOMENT');

        svg.append('line')
            .attr('x1', panelX + 20).attr('y1', panelY + 38)
            .attr('x2', panelX + panelW - 20).attr('y2', panelY + 38)
            .attr('stroke', '#1e3a5f').attr('stroke-width', 1).attr('stroke-opacity', 0.2);

        // User's domain
        svg.append('text')
            .attr('x', panelX + 20).attr('y', panelY + 60)
            .attr('font-size', '12px').attr('font-weight', '600')
            .attr('fill', '#991b1b')
            .text('Your domain:');
        svg.append('text')
            .attr('x', panelX + 110).attr('y', panelY + 60)
            .attr('font-size', '12px')
            .attr('fill', '#374151')
            .text('Software / Pathology Informatics');

        // Arrow
        svg.append('text')
            .attr('x', panelX + panelW / 2).attr('y', panelY + 84)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('fill', '#374151')
            .text('\u2193  AI surfaces approach from  \u2193');

        // Solution domain
        svg.append('text')
            .attr('x', panelX + 20).attr('y', panelY + 108)
            .attr('font-size', '12px').attr('font-weight', '600')
            .attr('fill', '#065f46')
            .text('Found field:');
        svg.append('text')
            .attr('x', panelX + 110).attr('y', panelY + 108)
            .attr('font-size', '12px')
            .attr('fill', '#374151')
            .text('Computational Linguistics');

        // Divider
        svg.append('line')
            .attr('x1', panelX + 20).attr('y1', panelY + 122)
            .attr('x2', panelX + panelW - 20).attr('y2', panelY + 122)
            .attr('stroke', '#1e3a5f').attr('stroke-width', 1).attr('stroke-opacity', 0.15);

        // Key insight
        svg.append('text')
            .attr('x', panelX + panelW / 2).attr('y', panelY + 148)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('font-weight', '700').attr('fill', '#1e3a5f')
            .text('The model didn\u2019t just write the code.');

        svg.append('text')
            .attr('x', panelX + panelW / 2).attr('y', panelY + 168)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('font-weight', '700').attr('fill', '#1e3a5f')
            .text('It found the field.');

        // ── Bottom takeaway ──
        svg.append('text')
            .attr('x', cx).attr('y', H - 12)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('fill', darkText).attr('font-style', 'italic')
            .text('I described the constraint. The model surfaced an approach from linguistics I would not have reached independently.');

        // ── Bauhaus bottom rule ──
        svg.append('line')
            .attr('x1', 40).attr('y1', H - 4)
            .attr('x2', W - 40).attr('y2', H - 4)
            .attr('stroke', darkText).attr('stroke-width', 1).attr('stroke-opacity', 0.12);
    }


    // ─── EVALUATION COST (option space expansion) ─────────────
    function evaluationCost(container, config) {
        var W = 1050, H = 560;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Transparent bg for test harness
        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', 'white').attr('fill-opacity', 0);

        // ── Layout: two zones separated by a transition arrow ──
        var leftCx = 220, rightCx = 740;
        var baseY = 260;

        // ── LEFT: Old option space (small, thick wall) ──
        var oldSize = 190;
        var wallThick = 14;

        // Thick wall (outer rect)
        svg.append('rect')
            .attr('x', leftCx - oldSize / 2 - wallThick)
            .attr('y', baseY - oldSize / 2 - wallThick)
            .attr('width', oldSize + wallThick * 2)
            .attr('height', oldSize + wallThick * 2)
            .attr('rx', 3)
            .attr('fill', '#991b1b').attr('fill-opacity', 0.12);

        // Inner space
        svg.append('rect')
            .attr('x', leftCx - oldSize / 2)
            .attr('y', baseY - oldSize / 2)
            .attr('width', oldSize).attr('height', oldSize)
            .attr('rx', 2)
            .attr('fill', '#fef2f2')
            .attr('stroke', '#991b1b').attr('stroke-width', wallThick)
            .attr('stroke-opacity', 0.35);

        // Label: "What you already knew"
        svg.append('text')
            .attr('x', leftCx).attr('y', baseY - 14)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('font-weight', '700').attr('fill', '#991b1b')
            .text('What you');
        svg.append('text')
            .attr('x', leftCx).attr('y', baseY + 6)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('font-weight', '700').attr('fill', '#991b1b')
            .text('already knew');

        // Wall annotation (left side)
        var wallLabelX = leftCx - oldSize / 2 - wallThick - 6;
        svg.append('text')
            .attr('x', wallLabelX).attr('y', baseY - 30)
            .attr('text-anchor', 'end').attr('font-size', '9px')
            .attr('font-weight', '600').attr('fill', '#991b1b')
            .attr('letter-spacing', '0.5px')
            .text('EVALUATION');
        svg.append('text')
            .attr('x', wallLabelX).attr('y', baseY - 19)
            .attr('text-anchor', 'end').attr('font-size', '9px')
            .attr('font-weight', '600').attr('fill', '#991b1b')
            .attr('letter-spacing', '0.5px')
            .text('TAX');

        // Wall cost details
        var costY = baseY + 16;
        var costs = ['Days of setup', 'Documentation', 'A colleague who knew it'];
        costs.forEach(function (c, i) {
            svg.append('text')
                .attr('x', wallLabelX).attr('y', costY + i * 14)
                .attr('text-anchor', 'end').attr('font-size', '9px')
                .attr('fill', '#6b7280')
                .text(c);
        });

        // ── TRANSITION ARROW ──
        var arrowY = baseY;
        var arrowX1 = leftCx + oldSize / 2 + wallThick + 24;
        var arrowX2 = rightCx - 200;

        svg.append('line')
            .attr('x1', arrowX1).attr('y1', arrowY)
            .attr('x2', arrowX2).attr('y2', arrowY)
            .attr('stroke', '#374151').attr('stroke-width', 2);

        // Arrowhead
        svg.append('polygon')
            .attr('points',
                arrowX2 + ',' + arrowY + ' ' +
                (arrowX2 - 10) + ',' + (arrowY - 5) + ' ' +
                (arrowX2 - 10) + ',' + (arrowY + 5))
            .attr('fill', '#374151');

        // Arrow label
        svg.append('text')
            .attr('x', (arrowX1 + arrowX2) / 2).attr('y', arrowY - 14)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('font-weight', '600').attr('fill', '#374151')
            .text('AI + Docker');

        svg.append('text')
            .attr('x', (arrowX1 + arrowX2) / 2).attr('y', arrowY + 22)
            .attr('text-anchor', 'middle').attr('font-size', '9px')
            .attr('fill', '#6b7280').attr('font-style', 'italic')
            .text('hours, sometimes minutes');

        // ── RIGHT: New option space (large, thin border) ──
        var newSize = 360;
        var thinBorder = 1.5;

        svg.append('rect')
            .attr('x', rightCx - newSize / 2)
            .attr('y', baseY - newSize / 2)
            .attr('width', newSize).attr('height', newSize)
            .attr('rx', 2)
            .attr('fill', '#ecfdf5')
            .attr('stroke', '#065f46').attr('stroke-width', thinBorder);

        // Ghost of old space inside (proportional comparison)
        svg.append('rect')
            .attr('x', rightCx - oldSize / 2)
            .attr('y', baseY - oldSize / 2)
            .attr('width', oldSize).attr('height', oldSize)
            .attr('rx', 2)
            .attr('fill', 'none')
            .attr('stroke', '#991b1b').attr('stroke-width', 1)
            .attr('stroke-dasharray', '4,4').attr('stroke-opacity', 0.4);

        // Ghost label
        svg.append('text')
            .attr('x', rightCx + oldSize / 2 + 6).attr('y', baseY + 4)
            .attr('font-size', '9px')
            .attr('fill', '#991b1b').attr('fill-opacity', 0.5)
            .attr('font-style', 'italic')
            .text('old boundary');

        // Label: "What actually exists"
        svg.append('text')
            .attr('x', rightCx).attr('y', baseY - newSize / 2 + 36)
            .attr('text-anchor', 'middle').attr('font-size', '16px')
            .attr('font-weight', '700').attr('fill', '#065f46')
            .text('What actually exists');

        // Expansion items in the new space (outside old boundary)
        var items = [
            { label: 'Unfamiliar stacks', x: rightCx - 140, y: baseY + 120 },
            { label: 'Alternative architectures', x: rightCx + 80, y: baseY + 130 },
            { label: 'New integrations', x: rightCx - 120, y: baseY - 120 },
            { label: 'Unexplored frameworks', x: rightCx + 100, y: baseY - 110 }
        ];

        items.forEach(function (item) {
            svg.append('circle')
                .attr('cx', item.x).attr('cy', item.y).attr('r', 3)
                .attr('fill', '#065f46').attr('fill-opacity', 0.5);
            svg.append('text')
                .attr('x', item.x + 8).attr('y', item.y + 4)
                .attr('font-size', '10px')
                .attr('fill', '#374151')
                .text(item.label);
        });

        // ── Area ratio annotation ──
        var ratio = Math.round((newSize * newSize) / (oldSize * oldSize) * 10) / 10;
        svg.append('text')
            .attr('x', rightCx).attr('y', baseY + newSize / 2 - 14)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#065f46').attr('font-weight', '600')
            .text(ratio + '\u00d7 the explorable space');

        // ── Top annotation ──
        svg.append('text')
            .attr('x', W / 2).attr('y', 24)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#6b7280').attr('letter-spacing', '1.5px')
            .text('THE OPTION SPACE BEFORE AND AFTER');

        // ── Column headers ──
        svg.append('text')
            .attr('x', leftCx).attr('y', baseY - oldSize / 2 - wallThick - 20)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('font-weight', '700').attr('fill', '#991b1b')
            .text('Before');

        svg.append('text')
            .attr('x', rightCx).attr('y', baseY - newSize / 2 - 14)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('font-weight', '700').attr('fill', '#065f46')
            .text('After');

        // ── Bottom takeaway ──
        svg.append('text')
            .attr('x', W / 2).attr('y', H - 28)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#374151').attr('font-style', 'italic')
            .text('Not about being faster at what you already do.');

        svg.append('text')
            .attr('x', W / 2).attr('y', H - 10)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#1f2937').attr('font-weight', '600')
            .text('About reaching options you would never have considered.');

        // ── Bauhaus bottom rule ──
        svg.append('line')
            .attr('x1', 40).attr('y1', H - 4)
            .attr('x2', W - 40).attr('y2', H - 4)
            .attr('stroke', '#1f2937').attr('stroke-width', 1).attr('stroke-opacity', 0.12);
    }


    // ─── INSTITUTIONAL CONTEXT (boundary map) ──────────────────
    function institutionalContext(container, config) {
        var W = 1050, H = 560;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Transparent bg for test harness
        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', 'white').attr('fill-opacity', 0);

        var cx = W / 2, cy = 265;

        // ── Layers from outermost to innermost ──
        // Each layer: label, color, whether AI can see it
        var layers = [
            {
                label: 'Organizational Readiness for Change',
                color: '#92400e',
                fill: '#fffbeb',
                visible: false
            },
            {
                label: 'Regulatory Requirements (inherited, not chosen)',
                color: '#991b1b',
                fill: '#fef2f2',
                visible: false
            },
            {
                label: 'Colleague Trust & Cooperation Networks',
                color: '#5b21b6',
                fill: '#f5f3ff',
                visible: false
            },
            {
                label: 'Departmental Ownership Boundaries',
                color: '#1e3a5f',
                fill: '#eff6ff',
                visible: false
            },
            {
                label: 'Epic / Beaker Integration Timelines',
                color: '#065f46',
                fill: '#ecfdf5',
                visible: false
            },
            {
                label: 'Your System',
                color: '#1f2937',
                fill: '#f0fdf4',
                visible: true
            }
        ];

        var n = layers.length;
        // Nested rectangle dimensions — outermost to innermost
        var outerW = 920, outerH = 420;
        var innerW = 180, innerH = 100;
        var stepW = (outerW - innerW) / (n - 1);
        var stepH = (outerH - innerH) / (n - 1);

        // ── Draw layers from outside in ──
        layers.forEach(function (layer, i) {
            var rw = outerW - i * stepW;
            var rh = outerH - i * stepH;
            var rx = cx - rw / 2;
            var ry = cy - rh / 2;

            var g = svg.append('g');

            // Rectangle
            g.append('rect')
                .attr('x', rx).attr('y', ry)
                .attr('width', rw).attr('height', rh)
                .attr('rx', i === n - 1 ? 4 : 2)
                .attr('fill', layer.fill)
                .attr('stroke', layer.color)
                .attr('stroke-width', i === n - 1 ? 2.5 : 1.5)
                .attr('stroke-dasharray', layer.visible ? 'none' : '8,4')
                .attr('stroke-opacity', layer.visible ? 1 : 0.6);

            // Label — positioned at top-left of each ring
            if (i < n - 1) {
                // Outer layers: label along top edge, inside the ring
                var labelX = rx + 14;
                var labelY = ry + 16;

                g.append('text')
                    .attr('x', labelX).attr('y', labelY)
                    .attr('font-size', '11px')
                    .attr('font-weight', '600')
                    .attr('fill', layer.color)
                    .text(layer.label);
            } else {
                // Innermost: centered label
                g.append('text')
                    .attr('x', cx).attr('y', cy - 6)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '15px')
                    .attr('font-weight', '700')
                    .attr('fill', layer.color)
                    .text(layer.label);

                g.append('text')
                    .attr('x', cx).attr('y', cy + 14)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '10px')
                    .attr('fill', '#6b7280')
                    .attr('letter-spacing', '1px')
                    .text('WHAT AI CAN SEE');
            }
        });

        // ── AI Visibility Horizon line ──
        // Drawn between the innermost and second-innermost layers
        var horizonLayer = n - 2; // Epic/Beaker layer index
        var hRw = outerW - horizonLayer * stepW;
        var hRh = outerH - horizonLayer * stepH;
        var hRx = cx - hRw / 2;
        var hRy = cy - hRh / 2;

        // Horizontal line across the full width at the boundary
        var lineY = hRy + hRh + 8;

        // Right-side annotation with arrow pointing inward
        var annotX = cx + outerW / 2 - 10;
        var arrowTipX = cx + innerW / 2 + 20;

        // Arrow line
        svg.append('line')
            .attr('x1', annotX).attr('y1', lineY)
            .attr('x2', arrowTipX).attr('y2', lineY)
            .attr('stroke', '#dc2626').attr('stroke-width', 2)
            .attr('stroke-opacity', 0.7);

        // Arrowhead
        svg.append('polygon')
            .attr('points', function () {
                var tx = arrowTipX;
                var ty = lineY;
                return (tx) + ',' + (ty) + ' ' +
                    (tx + 8) + ',' + (ty - 4) + ' ' +
                    (tx + 8) + ',' + (ty + 4);
            })
            .attr('fill', '#dc2626').attr('fill-opacity', 0.7);

        // "AI VISIBILITY HORIZON" label
        svg.append('text')
            .attr('x', annotX + 4).attr('y', lineY + 4)
            .attr('text-anchor', 'start')
            .attr('font-size', '9px')
            .attr('font-weight', '700')
            .attr('fill', '#dc2626')
            .attr('letter-spacing', '1px')
            .text('AI VISIBILITY');

        svg.append('text')
            .attr('x', annotX + 4).attr('y', lineY + 15)
            .attr('text-anchor', 'start')
            .attr('font-size', '9px')
            .attr('font-weight', '700')
            .attr('fill', '#dc2626')
            .attr('letter-spacing', '1px')
            .text('HORIZON');

        // Left-side: mirror arrow
        var leftAnnotX = cx - outerW / 2 + 10;
        var leftArrowTipX = cx - innerW / 2 - 20;

        svg.append('line')
            .attr('x1', leftAnnotX).attr('y1', lineY)
            .attr('x2', leftArrowTipX).attr('y2', lineY)
            .attr('stroke', '#dc2626').attr('stroke-width', 2)
            .attr('stroke-opacity', 0.7);

        svg.append('polygon')
            .attr('points', function () {
                var tx = leftArrowTipX;
                var ty = lineY;
                return (tx) + ',' + (ty) + ' ' +
                    (tx - 8) + ',' + (ty - 4) + ' ' +
                    (tx - 8) + ',' + (ty + 4);
            })
            .attr('fill', '#dc2626').attr('fill-opacity', 0.7);

        svg.append('text')
            .attr('x', leftAnnotX - 4).attr('y', lineY + 4)
            .attr('text-anchor', 'end')
            .attr('font-size', '9px')
            .attr('font-weight', '700')
            .attr('fill', '#dc2626')
            .attr('letter-spacing', '1px')
            .text('AI VISIBILITY');

        svg.append('text')
            .attr('x', leftAnnotX - 4).attr('y', lineY + 15)
            .attr('text-anchor', 'end')
            .attr('font-size', '9px')
            .attr('font-weight', '700')
            .attr('fill', '#dc2626')
            .attr('letter-spacing', '1px')
            .text('HORIZON');

        // ── Top title annotation ──
        svg.append('text')
            .attr('x', cx).attr('y', 22)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10px')
            .attr('fill', '#6b7280')
            .attr('letter-spacing', '1.5px')
            .text('INSTITUTIONAL CONTEXT — INVISIBLE TO THE MODEL');

        // ── Bottom takeaway ──
        svg.append('text')
            .attr('x', cx).attr('y', H - 30)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px')
            .attr('fill', '#374151')
            .attr('font-style', 'italic')
            .text('Institutional knowledge is not data. AI cannot retrieve it from a prompt.');

        svg.append('text')
            .attr('x', cx).attr('y', H - 12)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px')
            .attr('fill', '#1f2937')
            .attr('font-weight', '600')
            .text('The human in the institutional context is irreplaceable.');

        // ── Bauhaus bottom rule ──
        svg.append('line')
            .attr('x1', 40).attr('y1', H - 4)
            .attr('x2', W - 40).attr('y2', H - 4)
            .attr('stroke', '#1f2937').attr('stroke-width', 1).attr('stroke-opacity', 0.12);
    }


    // ─── THREE OBSERVATIONS CONVERGENCE ────────────────────────
    function threeObservations(container, config) {
        var W = 1050, H = 560;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Transparent background for test harness detection
        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', 'white').attr('fill-opacity', 0);

        var cx = W / 2;

        // ── Color palette (Bauhaus-inspired, WCAG AA on white) ──
        var obs = [
            {
                color: '#991b1b',       // deep crimson
                accent: '#fef2f2',      // faint blush bg
                num: '1',
                keyword: 'Domain Knowledge',
                verb: 'went up in value',
                line1: 'AI handles the generic.',
                line2: 'The specific becomes more valuable.',
                icon: 'diamond'         // expertise = cut gem
            },
            {
                color: '#1e3a5f',       // deep navy
                accent: '#eff6ff',      // faint blue bg
                num: '2',
                keyword: 'Architectural Clarity',
                verb: 'is now a forcing function',
                line1: 'Vague requirements produce',
                line2: 'working code that does the wrong thing.',
                icon: 'square'          // structure = square
            },
            {
                color: '#92400e',       // deep amber
                accent: '#fffbeb',      // faint warm bg
                num: '3',
                keyword: 'Human Judgment',
                verb: 'is the differentiator',
                line1: 'Not the model. Not the tool.',
                line2: 'The person who knows what and why.',
                icon: 'circle'          // human = circle
            }
        ];

        var panelW = 280, panelH = 320, panelGap = 42;
        var panelY = 30;
        var totalW = obs.length * panelW + (obs.length - 1) * panelGap;
        var startX = (W - totalW) / 2;

        // ── Convergence point ──
        var focalY = panelY + panelH + 80;
        var focalR = 36;

        // ── Draw convergence lines FIRST (behind panels) ──
        obs.forEach(function (o, i) {
            var px = startX + i * (panelW + panelGap) + panelW / 2;
            var lineStartY = panelY + panelH + 4;

            svg.append('line')
                .attr('x1', px).attr('y1', lineStartY)
                .attr('x2', cx).attr('y2', focalY - focalR - 4)
                .attr('stroke', o.color).attr('stroke-width', 2.5)
                .attr('stroke-opacity', 0.5)
                .attr('stroke-dasharray', '6,4');
        });

        // ── Draw panels ──
        obs.forEach(function (o, i) {
            var px = startX + i * (panelW + panelGap);
            var pCx = px + panelW / 2;
            var g = svg.append('g');

            // Panel background
            g.append('rect')
                .attr('x', px).attr('y', panelY)
                .attr('width', panelW).attr('height', panelH)
                .attr('rx', 4)
                .attr('fill', o.accent)
                .attr('stroke', o.color).attr('stroke-width', 2)
                .attr('stroke-opacity', 0.3);

            // Top color bar (Bauhaus accent)
            g.append('rect')
                .attr('x', px).attr('y', panelY)
                .attr('width', panelW).attr('height', 6)
                .attr('rx', 0).attr('fill', o.color);
            // Round just the top corners by overlaying the bar
            g.append('rect')
                .attr('x', px).attr('y', panelY)
                .attr('width', panelW).attr('height', 6)
                .attr('rx', 4).attr('fill', o.color);
            g.append('rect')
                .attr('x', px).attr('y', panelY + 3)
                .attr('width', panelW).attr('height', 3)
                .attr('fill', o.color);

            // Geometric icon (Bauhaus shapes)
            var iconY = panelY + 56;
            var iconSize = 28;
            if (o.icon === 'diamond') {
                g.append('rect')
                    .attr('x', pCx - iconSize / 2).attr('y', iconY - iconSize / 2)
                    .attr('width', iconSize).attr('height', iconSize)
                    .attr('fill', 'none').attr('stroke', o.color).attr('stroke-width', 2.5)
                    .attr('transform', 'rotate(45,' + pCx + ',' + iconY + ')');
            } else if (o.icon === 'square') {
                g.append('rect')
                    .attr('x', pCx - iconSize / 2).attr('y', iconY - iconSize / 2)
                    .attr('width', iconSize).attr('height', iconSize)
                    .attr('fill', 'none').attr('stroke', o.color).attr('stroke-width', 2.5);
            } else if (o.icon === 'circle') {
                g.append('circle')
                    .attr('cx', pCx).attr('cy', iconY).attr('r', iconSize / 2)
                    .attr('fill', 'none').attr('stroke', o.color).attr('stroke-width', 2.5);
            }

            // Number inside icon
            g.append('text')
                .attr('x', pCx).attr('y', iconY + 5)
                .attr('text-anchor', 'middle').attr('font-size', '15px')
                .attr('font-weight', '700').attr('fill', o.color)
                .text(o.num);

            // Keyword heading
            g.append('text')
                .attr('x', pCx).attr('y', iconY + 46)
                .attr('text-anchor', 'middle').attr('font-size', '17px')
                .attr('font-weight', '700').attr('fill', o.color)
                .text(o.keyword);

            // Verb/relationship (lighter weight)
            g.append('text')
                .attr('x', pCx).attr('y', iconY + 68)
                .attr('text-anchor', 'middle').attr('font-size', '12px')
                .attr('font-weight', '400').attr('fill', '#4b5563')
                .attr('font-style', 'italic')
                .text(o.verb);

            // Horizontal rule
            g.append('line')
                .attr('x1', px + 30).attr('y1', iconY + 84)
                .attr('x2', px + panelW - 30).attr('y2', iconY + 84)
                .attr('stroke', o.color).attr('stroke-width', 1).attr('stroke-opacity', 0.25);

            // Distilled insight (two lines)
            g.append('text')
                .attr('x', pCx).attr('y', iconY + 110)
                .attr('text-anchor', 'middle').attr('font-size', '13px')
                .attr('fill', '#1f2937')
                .text(o.line1);

            g.append('text')
                .attr('x', pCx).attr('y', iconY + 130)
                .attr('text-anchor', 'middle').attr('font-size', '13px')
                .attr('fill', '#1f2937')
                .attr('font-weight', '600')
                .text(o.line2);

            // Bauhaus bottom rule inside panel
            g.append('line')
                .attr('x1', px + 20).attr('y1', panelY + panelH - 20)
                .attr('x2', px + panelW - 20).attr('y2', panelY + panelH - 20)
                .attr('stroke', o.color).attr('stroke-width', 1).attr('stroke-opacity', 0.15);

            // "Observation" label at bottom of panel
            g.append('text')
                .attr('x', pCx).attr('y', panelY + panelH - 8)
                .attr('text-anchor', 'middle').attr('font-size', '9px')
                .attr('fill', '#6b7280').attr('letter-spacing', '2px')
                .text('OBSERVATION');
        });

        // ── Focal convergence point ──
        // Outer ring (subtle)
        svg.append('circle')
            .attr('cx', cx).attr('cy', focalY).attr('r', focalR + 6)
            .attr('fill', 'none').attr('stroke', '#1f2937').attr('stroke-width', 1.5)
            .attr('stroke-opacity', 0.2);

        // Inner circle (outlined, Bauhaus-style)
        svg.append('circle')
            .attr('cx', cx).attr('cy', focalY).attr('r', focalR)
            .attr('fill', '#f9fafb')
            .attr('stroke', '#1f2937').attr('stroke-width', 3);

        // "YOU" label
        svg.append('text')
            .attr('x', cx).attr('y', focalY + 7)
            .attr('text-anchor', 'middle').attr('font-size', '20px')
            .attr('font-weight', '700').attr('fill', '#1f2937')
            .attr('letter-spacing', '3px')
            .text('YOU');

        // ── Takeaway line below focal point ──
        svg.append('text')
            .attr('x', cx).attr('y', focalY + focalR + 30)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('fill', '#374151').attr('font-style', 'italic')
            .text('The differentiator was always you.');

        // ── Top annotation ──
        svg.append('text')
            .attr('x', cx).attr('y', 16)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#6b7280').attr('letter-spacing', '1.5px')
            .text('OBSERVATIONS, NOT PRESCRIPTIONS');

        // ── Bauhaus rule at very bottom ──
        svg.append('line')
            .attr('x1', 40).attr('y1', H - 8)
            .attr('x2', W - 40).attr('y2', H - 8)
            .attr('stroke', '#1f2937').attr('stroke-width', 1).attr('stroke-opacity', 0.15);
    }


    // ─── XENONYM SYNTHESIS (horizon expansion) ──────────────
    function xenonymSynthesis(container, config) {
        var W = 1100, H = 560;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', 'white').attr('fill-opacity', 0);

        var darkText = '#1f2937';
        var cx = W / 2;

        // ── Color palette ──
        var seedColor = '#991b1b';
        var aiColor = '#1e3a5f';
        var emergeColor = '#065f46';
        var accentGold = '#92400e';

        // ══════════════════════════════════════════════
        // TOP ANNOTATION
        // ══════════════════════════════════════════════
        svg.append('text')
            .attr('x', cx).attr('y', 22)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#6b7280').attr('letter-spacing', '1.5px')
            .text('WHAT XENONYM ILLUSTRATES');

        // ══════════════════════════════════════════════
        // LEFT: THE SEED PROBLEM (narrow)
        // ══════════════════════════════════════════════
        var seedX = 40, seedY = 60, seedW = 180, seedH = 130;

        svg.append('rect')
            .attr('x', seedX).attr('y', seedY)
            .attr('width', seedW).attr('height', seedH)
            .attr('rx', 3)
            .attr('fill', '#fef2f2')
            .attr('stroke', seedColor).attr('stroke-width', 2);

        // Top accent bar
        svg.append('rect')
            .attr('x', seedX).attr('y', seedY)
            .attr('width', seedW).attr('height', 5)
            .attr('fill', seedColor);

        svg.append('text')
            .attr('x', seedX + seedW / 2).attr('y', seedY + 34)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('font-weight', '700').attr('fill', seedColor)
            .text('Seed Problem');

        svg.append('text')
            .attr('x', seedX + seedW / 2).attr('y', seedY + 56)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#4b5563')
            .text('"I need safe test names"');

        svg.append('text')
            .attr('x', seedX + seedW / 2).attr('y', seedY + 76)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#6b7280')
            .text('Narrow, specific,');
        svg.append('text')
            .attr('x', seedX + seedW / 2).attr('y', seedY + 90)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#6b7280')
            .text('single-use intent');

        // Label below seed
        svg.append('text')
            .attr('x', seedX + seedW / 2).attr('y', seedY + seedH + 18)
            .attr('text-anchor', 'middle').attr('font-size', '9px')
            .attr('fill', seedColor).attr('letter-spacing', '1.5px')
            .text('WOULD NOT HAVE BEEN BUILT');

        // ══════════════════════════════════════════════
        // EXPANSION ARROW: seed → AI zone
        // ══════════════════════════════════════════════
        var arrowX1 = seedX + seedW + 12;
        var arrowX2 = 290;
        var arrowY = seedY + seedH / 2;

        svg.append('line')
            .attr('x1', arrowX1).attr('y1', arrowY)
            .attr('x2', arrowX2).attr('y2', arrowY)
            .attr('stroke', darkText).attr('stroke-width', 2);
        svg.append('polygon')
            .attr('points',
                arrowX2 + ',' + arrowY + ' ' +
                (arrowX2 - 8) + ',' + (arrowY - 4) + ' ' +
                (arrowX2 - 8) + ',' + (arrowY + 4))
            .attr('fill', darkText);

        svg.append('text')
            .attr('x', (arrowX1 + arrowX2) / 2).attr('y', arrowY - 10)
            .attr('text-anchor', 'middle').attr('font-size', '9px')
            .attr('fill', '#6b7280').attr('font-style', 'italic')
            .text('AI made it feasible');

        // ══════════════════════════════════════════════
        // CENTER: AI INTERVENTION — THREE FACETS
        // ══════════════════════════════════════════════
        var aiZoneX = 300, aiZoneY = 40, aiZoneW = 460, aiZoneH = 180;

        // Subtle background for the AI zone
        svg.append('rect')
            .attr('x', aiZoneX).attr('y', aiZoneY)
            .attr('width', aiZoneW).attr('height', aiZoneH)
            .attr('rx', 4)
            .attr('fill', '#eff6ff')
            .attr('stroke', aiColor).attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '8,4');

        svg.append('text')
            .attr('x', aiZoneX + aiZoneW / 2).attr('y', aiZoneY + 22)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('font-weight', '700').attr('fill', aiColor)
            .attr('letter-spacing', '1.5px')
            .text('AI EXPANDED THE HORIZON');

        // Three facet cards inside the AI zone
        var facets = [
            {
                title: 'Cross-Domain',
                title2: 'Discovery',
                body: 'Surfaced computational',
                body2: 'linguistics — a domain',
                body3: 'you would not have searched',
                icon: 'diamond'
            },
            {
                title: 'Edge Case',
                title2: 'Anticipation',
                body: 'Systematic adversarial',
                body2: 'testing before production',
                body3: 'needs it',
                icon: 'square'
            },
            {
                title: 'Architectural',
                title2: 'Generalization',
                body: 'Recognized the pattern',
                body2: 'is more general: flexible',
                body3: 'schema, not predefined',
                icon: 'circle'
            }
        ];

        var fCardW = 136, fCardH = 120, fCardGap = 12;
        var fStartX = aiZoneX + (aiZoneW - (facets.length * fCardW + (facets.length - 1) * fCardGap)) / 2;
        var fStartY = aiZoneY + 36;

        facets.forEach(function (f, i) {
            var fx = fStartX + i * (fCardW + fCardGap);
            var fCx = fx + fCardW / 2;

            svg.append('rect')
                .attr('x', fx).attr('y', fStartY)
                .attr('width', fCardW).attr('height', fCardH)
                .attr('rx', 3)
                .attr('fill', 'white')
                .attr('stroke', aiColor).attr('stroke-width', 1.5);

            // Bauhaus icon
            var iconY = fStartY + 20;
            var iconSize = 14;
            if (f.icon === 'diamond') {
                svg.append('rect')
                    .attr('x', fCx - iconSize / 2).attr('y', iconY - iconSize / 2)
                    .attr('width', iconSize).attr('height', iconSize)
                    .attr('fill', 'none').attr('stroke', aiColor).attr('stroke-width', 2)
                    .attr('transform', 'rotate(45,' + fCx + ',' + iconY + ')');
            } else if (f.icon === 'square') {
                svg.append('rect')
                    .attr('x', fCx - iconSize / 2).attr('y', iconY - iconSize / 2)
                    .attr('width', iconSize).attr('height', iconSize)
                    .attr('fill', 'none').attr('stroke', aiColor).attr('stroke-width', 2);
            } else {
                svg.append('circle')
                    .attr('cx', fCx).attr('cy', iconY).attr('r', iconSize / 2)
                    .attr('fill', 'none').attr('stroke', aiColor).attr('stroke-width', 2);
            }

            // Title (two lines)
            svg.append('text')
                .attr('x', fCx).attr('y', iconY + 24)
                .attr('text-anchor', 'middle').attr('font-size', '12px')
                .attr('font-weight', '700').attr('fill', aiColor)
                .text(f.title);
            svg.append('text')
                .attr('x', fCx).attr('y', iconY + 38)
                .attr('text-anchor', 'middle').attr('font-size', '12px')
                .attr('font-weight', '700').attr('fill', aiColor)
                .text(f.title2);

            // Body (three lines)
            svg.append('text')
                .attr('x', fCx).attr('y', iconY + 58)
                .attr('text-anchor', 'middle').attr('font-size', '10px')
                .attr('fill', '#4b5563')
                .text(f.body);
            svg.append('text')
                .attr('x', fCx).attr('y', iconY + 72)
                .attr('text-anchor', 'middle').attr('font-size', '10px')
                .attr('fill', '#4b5563')
                .text(f.body2);
            svg.append('text')
                .attr('x', fCx).attr('y', iconY + 86)
                .attr('text-anchor', 'middle').attr('font-size', '10px')
                .attr('fill', '#4b5563')
                .text(f.body3);
        });

        // ══════════════════════════════════════════════
        // EXPANSION ARROW: AI zone → emerged tool
        // ══════════════════════════════════════════════
        var arrow2X1 = aiZoneX + aiZoneW + 12;
        var arrow2X2 = 830;
        var arrow2Y = aiZoneY + aiZoneH / 2;

        svg.append('line')
            .attr('x1', arrow2X1).attr('y1', arrow2Y)
            .attr('x2', arrow2X2).attr('y2', arrow2Y)
            .attr('stroke', darkText).attr('stroke-width', 2);
        svg.append('polygon')
            .attr('points',
                arrow2X2 + ',' + arrow2Y + ' ' +
                (arrow2X2 - 8) + ',' + (arrow2Y - 4) + ' ' +
                (arrow2X2 - 8) + ',' + (arrow2Y + 4))
            .attr('fill', darkText);

        // ══════════════════════════════════════════════
        // RIGHT: WHAT EMERGED (wide, open)
        // ══════════════════════════════════════════════
        var emergeX = 840, emergeY = 42, emergeW = 230, emergeH = 175;

        svg.append('rect')
            .attr('x', emergeX).attr('y', emergeY)
            .attr('width', emergeW).attr('height', emergeH)
            .attr('rx', 3)
            .attr('fill', '#ecfdf5')
            .attr('stroke', emergeColor).attr('stroke-width', 2);

        // Top accent bar
        svg.append('rect')
            .attr('x', emergeX).attr('y', emergeY)
            .attr('width', emergeW).attr('height', 5)
            .attr('fill', emergeColor);

        svg.append('text')
            .attr('x', emergeX + emergeW / 2).attr('y', emergeY + 30)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('font-weight', '700').attr('fill', emergeColor)
            .text('What Emerged');

        svg.append('text')
            .attr('x', emergeX + emergeW / 2).attr('y', emergeY + 52)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#374151')
            .text('A general-purpose');
        svg.append('text')
            .attr('x', emergeX + emergeW / 2).attr('y', emergeY + 66)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#374151')
            .text('supplementary tool');

        svg.append('text')
            .attr('x', emergeX + emergeW / 2).attr('y', emergeY + 90)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#4b5563')
            .text('Flexible schema');
        svg.append('text')
            .attr('x', emergeX + emergeW / 2).attr('y', emergeY + 104)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#4b5563')
            .text('Adversarial edge cases');
        svg.append('text')
            .attr('x', emergeX + emergeW / 2).attr('y', emergeY + 118)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#4b5563')
            .text('Fully public');

        // Label below emerge
        svg.append('text')
            .attr('x', emergeX + emergeW / 2).attr('y', emergeY + emergeH + 18)
            .attr('text-anchor', 'middle').attr('font-size', '9px')
            .attr('fill', emergeColor).attr('letter-spacing', '1.5px')
            .text('WOULD NOT HAVE EXISTED');

        // ══════════════════════════════════════════════
        // BOTTOM: INTEGRITY BY CONSTRUCTION
        // ══════════════════════════════════════════════
        var intY = 280;

        // Divider line
        svg.append('line')
            .attr('x1', 60).attr('y1', intY)
            .attr('x2', W - 60).attr('y2', intY)
            .attr('stroke', darkText).attr('stroke-width', 1).attr('stroke-opacity', 0.15);

        // Section heading
        svg.append('text')
            .attr('x', cx).attr('y', intY + 30)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('font-weight', '700').attr('fill', accentGold)
            .attr('letter-spacing', '1.5px')
            .text('SYSTEM INTEGRITY BY CONSTRUCTION, NOT BY RESTRICTION');

        // Two contrasting approaches
        var contrastY = intY + 50;
        var contrastW = 420, contrastH = 130, contrastGap = 60;
        var leftX = cx - contrastW - contrastGap / 2;
        var rightX = cx + contrastGap / 2;

        // Left: restriction approach (faded, struck)
        svg.append('rect')
            .attr('x', leftX).attr('y', contrastY)
            .attr('width', contrastW).attr('height', contrastH)
            .attr('rx', 3)
            .attr('fill', '#fef2f2')
            .attr('stroke', seedColor).attr('stroke-width', 1)
            .attr('stroke-opacity', 0.4);

        svg.append('text')
            .attr('x', leftX + contrastW / 2).attr('y', contrastY + 26)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('font-weight', '700').attr('fill', seedColor)
            .attr('fill-opacity', 0.5)
            .text('By Restriction');

        var restrictLines = [
            'Hide real data behind access controls',
            'Hope edge cases don\u2019t appear in production',
            'Restrict inputs to avoid breakage'
        ];
        restrictLines.forEach(function (line, i) {
            svg.append('text')
                .attr('x', leftX + contrastW / 2).attr('y', contrastY + 54 + i * 20)
                .attr('text-anchor', 'middle').attr('font-size', '11px')
                .attr('fill', seedColor).attr('fill-opacity', 0.45)
                .text(line);
        });

        // Strike-through across left panel
        svg.append('line')
            .attr('x1', leftX + 30).attr('y1', contrastY + contrastH / 2)
            .attr('x2', leftX + contrastW - 30).attr('y2', contrastY + contrastH / 2)
            .attr('stroke', seedColor).attr('stroke-width', 2)
            .attr('stroke-opacity', 0.35);

        // Right: construction approach (bold, present)
        svg.append('rect')
            .attr('x', rightX).attr('y', contrastY)
            .attr('width', contrastW).attr('height', contrastH)
            .attr('rx', 3)
            .attr('fill', '#ecfdf5')
            .attr('stroke', emergeColor).attr('stroke-width', 2);

        svg.append('text')
            .attr('x', rightX + contrastW / 2).attr('y', contrastY + 26)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('font-weight', '700').attr('fill', emergeColor)
            .text('By Construction');

        var constructLines = [
            'Generate adversarial cases deliberately',
            'Test edge cases before they reach production',
            'The data itself ensures integrity'
        ];
        constructLines.forEach(function (line, i) {
            svg.append('text')
                .attr('x', rightX + contrastW / 2).attr('y', contrastY + 54 + i * 20)
                .attr('text-anchor', 'middle').attr('font-size', '11px')
                .attr('fill', '#374151')
                .text(line);
        });

        // ══════════════════════════════════════════════
        // BOTTOM: TAKEAWAY
        // ══════════════════════════════════════════════
        var takeY = contrastY + contrastH + 40;

        svg.append('line')
            .attr('x1', 160).attr('y1', takeY)
            .attr('x2', W - 160).attr('y2', takeY)
            .attr('stroke', darkText).attr('stroke-width', 1).attr('stroke-opacity', 0.15);

        svg.append('text')
            .attr('x', cx).attr('y', takeY + 32)
            .attr('text-anchor', 'middle').attr('font-size', '16px')
            .attr('font-weight', '700').attr('fill', darkText)
            .text('AI qualitatively transformed the development of supplementary technologies.');

        svg.append('text')
            .attr('x', cx).attr('y', takeY + 56)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#374151').attr('font-style', 'italic')
            .text('Tools that were never worth building now emerge naturally from the work.');

        // ── Bauhaus bottom rule ──
        svg.append('line')
            .attr('x1', 40).attr('y1', H - 4)
            .attr('x2', W - 40).attr('y2', H - 4)
            .attr('stroke', darkText).attr('stroke-width', 1).attr('stroke-opacity', 0.12);
    }


    // ─── IBIS FLOW — natural-language search + provenance pathway ──
    function ibisFlow(container, config) {
        var W = 1200, H = 700;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Transparent bg for test harness
        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', 'white').attr('fill-opacity', 0);

        var ink     = '#1f2937';
        var subInk  = '#4b5563';
        var muted   = '#6b7280';
        var rule    = '#cbd5e1';
        var accent  = '#1B3A5C';
        var green   = '#065f46';
        var crimson = '#991b1b';

        // ─── TITLE BLOCK (centered) ─────────────────────────
        svg.append('text')
            .attr('x', W / 2).attr('y', 56)
            .attr('text-anchor', 'middle')
            .attr('font-size', '26px').attr('font-weight', '700')
            .attr('fill', accent)
            .text('IBIS — Natural-Language Search Over Pathology Data');

        svg.append('text')
            .attr('x', W / 2).attr('y', 84)
            .attr('text-anchor', 'middle')
            .attr('font-size', '15px').attr('fill', subInk)
            .text('What a small team can now deliver — live demo');

        svg.append('line')
            .attr('x1', 80).attr('y1', 102).attr('x2', W - 80).attr('y2', 102)
            .attr('stroke', rule).attr('stroke-width', 1);

        // ─── REGISTER 1: WHAT THE USER DOES ─────────────────
        svg.append('text')
            .attr('x', W / 2).attr('y', 128)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('font-weight', '700')
            .attr('fill', muted).attr('letter-spacing', '2.5px')
            .text('REGISTER 1   ·   WHAT THE USER DOES');

        var topY = 220;

        // Node 1: Clinician (left)
        var n1x = 170, nodeR = 52;
        svg.append('circle')
            .attr('cx', n1x).attr('cy', topY).attr('r', nodeR)
            .attr('fill', 'white').attr('stroke', ink).attr('stroke-width', 2);
        svg.append('text')
            .attr('x', n1x).attr('y', topY - 4)
            .attr('text-anchor', 'middle').attr('font-size', '15px')
            .attr('font-weight', '700').attr('fill', ink)
            .text('Clinician');
        svg.append('text')
            .attr('x', n1x).attr('y', topY + 16)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', subInk).text('Researcher');

        // IBIS box (center)
        var ibisW = 240, ibisH = 110;
        var ibisCx = 600;
        var ibisX = ibisCx - ibisW / 2;
        var ibisY = topY - ibisH / 2;

        svg.append('rect')
            .attr('x', ibisX).attr('y', ibisY)
            .attr('width', ibisW).attr('height', ibisH)
            .attr('fill', 'white').attr('stroke', accent).attr('stroke-width', 2.5);
        svg.append('text')
            .attr('x', ibisCx).attr('y', topY - 22)
            .attr('text-anchor', 'middle').attr('font-size', '24px')
            .attr('font-weight', '700').attr('fill', accent).text('IBIS');
        svg.append('text')
            .attr('x', ibisCx).attr('y', topY + 2)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', subInk).text('natural language → query');
        svg.append('text')
            .attr('x', ibisCx).attr('y', topY + 22)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', subInk).text('over structured + unstructured data');

        // Cohort answer (right)
        var ansW = 200, ansH = 110;
        var ansCx = 980;
        var ansX = ansCx - ansW / 2;
        var ansY = topY - ansH / 2;
        svg.append('rect')
            .attr('x', ansX).attr('y', ansY)
            .attr('width', ansW).attr('height', ansH)
            .attr('fill', 'white').attr('stroke', ink).attr('stroke-width', 2);
        svg.append('text')
            .attr('x', ansCx).attr('y', ansY + 22)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('font-weight', '700').attr('fill', subInk)
            .attr('letter-spacing', '1.5px').text('COHORT · 187 CASES');

        // sparkline bars
        var bars = [22, 38, 31, 47, 58, 44, 62];
        var barW = 18, barGap = 6;
        var barsTotalW = bars.length * barW + (bars.length - 1) * barGap;
        var barsStartX = ansCx - barsTotalW / 2;
        var barBaseY = ansY + ansH - 14;
        bars.forEach(function (v, i) {
            svg.append('rect')
                .attr('x', barsStartX + i * (barW + barGap))
                .attr('y', barBaseY - v)
                .attr('width', barW).attr('height', v)
                .attr('fill', accent).attr('fill-opacity', 0.85);
        });

        // Arrow 1: clinician → IBIS  (cleared from clinician edge to IBIS edge)
        svg.append('line')
            .attr('x1', n1x + nodeR + 6).attr('y1', topY)
            .attr('x2', ibisX - 8).attr('y2', topY)
            .attr('stroke', ink).attr('stroke-width', 1.5);
        svg.append('path')
            .attr('d', 'M' + (ibisX - 8) + ',' + topY + ' l-9,-5 l0,10 z')
            .attr('fill', ink);

        // Arrow 2: IBIS → cohort
        svg.append('line')
            .attr('x1', ibisX + ibisW + 8).attr('y1', topY)
            .attr('x2', ansX - 8).attr('y2', topY)
            .attr('stroke', ink).attr('stroke-width', 1.5);
        svg.append('path')
            .attr('d', 'M' + (ansX - 8) + ',' + topY + ' l-9,-5 l0,10 z')
            .attr('fill', ink);

        // Question annotation — italicized, ABOVE arrow 1, well clear of nodes
        var arrow1Mid = (n1x + nodeR + 6 + ibisX - 8) / 2;
        svg.append('text')
            .attr('x', arrow1Mid).attr('y', topY - 38)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px').attr('fill', accent)
            .attr('font-style', 'italic')
            .text('"How many invasive ductal carcinomas');
        svg.append('text')
            .attr('x', arrow1Mid).attr('y', topY - 22)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px').attr('fill', accent)
            .attr('font-style', 'italic')
            .text('with HER2 amplification in the last 18 months?"');

        // "SECONDS, NOT WEEKS" — under arrow 2
        var arrow2Mid = (ibisX + ibisW + 8 + ansX - 8) / 2;
        svg.append('text')
            .attr('x', arrow2Mid).attr('y', topY + 22)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', muted).attr('letter-spacing', '1.5px')
            .text('SECONDS, NOT WEEKS');

        // "no SQL · no analyst queue" — under cohort
        svg.append('text')
            .attr('x', ansCx).attr('y', ansY + ansH + 18)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', green).attr('font-style', 'italic')
            .text('no SQL · no analyst queue');

        // ─── DIVIDING RULE ─────────────────────────────────
        svg.append('line')
            .attr('x1', 80).attr('y1', 340).attr('x2', W - 80).attr('y2', 340)
            .attr('stroke', rule).attr('stroke-width', 1);

        // ─── REGISTER 2: THE PATHWAY IN ─────────────────────
        svg.append('text')
            .attr('x', W / 2).attr('y', 366)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('font-weight', '700')
            .attr('fill', muted).attr('letter-spacing', '2.5px')
            .text('REGISTER 2   ·   THE PATHWAY IN');

        // ── Bottom register: outside Yale → perimeter → inside Yale ──
        var perimX = W / 2;
        var boxW = 480, boxH = 190;
        var bottomBoxY = 410;     // top of boxes
        var leftBoxX = perimX - boxW - 30;
        var rightBoxX = perimX + 30;

        // YALE SECURITY PERIMETER — label above
        svg.append('text')
            .attr('x', perimX).attr('y', bottomBoxY - 16)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('font-weight', '700').attr('fill', crimson)
            .attr('letter-spacing', '2px')
            .text('YALE SECURITY PERIMETER');

        // LEFT region (outside)
        svg.append('rect')
            .attr('x', leftBoxX).attr('y', bottomBoxY)
            .attr('width', boxW).attr('height', boxH)
            .attr('fill', 'white').attr('stroke', muted)
            .attr('stroke-width', 1).attr('stroke-dasharray', '5,4');

        svg.append('text')
            .attr('x', leftBoxX + boxW / 2).attr('y', bottomBoxY + 26)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px').attr('font-weight', '700')
            .attr('fill', muted).attr('letter-spacing', '2px')
            .text('OUTSIDE YALE   ·   PROTOTYPE');

        var leftItems = [
            'AI-assisted build',
            'Docker-based stack (Elasticsearch)',
            'Synthetic data only — no PHI',
            'Demonstrated from external machine'
        ];
        leftItems.forEach(function (txt, i) {
            var ly = bottomBoxY + 64 + i * 28;
            svg.append('circle')
                .attr('cx', leftBoxX + 38).attr('cy', ly - 4)
                .attr('r', 2.5).attr('fill', subInk);
            svg.append('text')
                .attr('x', leftBoxX + 50).attr('y', ly)
                .attr('font-size', '13px').attr('fill', subInk).text(txt);
        });

        // RIGHT region (inside)
        svg.append('rect')
            .attr('x', rightBoxX).attr('y', bottomBoxY)
            .attr('width', boxW).attr('height', boxH)
            .attr('fill', 'white').attr('stroke', accent).attr('stroke-width', 2);

        svg.append('text')
            .attr('x', rightBoxX + boxW / 2).attr('y', bottomBoxY + 26)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px').attr('font-weight', '700')
            .attr('fill', accent).attr('letter-spacing', '2px')
            .text('INSIDE YALE   ·   PRODUCTION');

        var rightItems = [
            'Brought in as open source',
            'Adopted to internal data model',
            'Enterprise GitHub  →  SPA review',
            'CI/CD · continuous integration'
        ];
        rightItems.forEach(function (txt, i) {
            var ry = bottomBoxY + 64 + i * 28;
            svg.append('circle')
                .attr('cx', rightBoxX + 38).attr('cy', ry - 4)
                .attr('r', 2.5).attr('fill', accent);
            svg.append('text')
                .attr('x', rightBoxX + 50).attr('y', ry)
                .attr('font-size', '13px').attr('fill', ink).text(txt);
        });

        // Vertical dashed perimeter line
        svg.append('line')
            .attr('x1', perimX).attr('y1', bottomBoxY - 6)
            .attr('x2', perimX).attr('y2', bottomBoxY + boxH + 6)
            .attr('stroke', crimson).attr('stroke-width', 2.5)
            .attr('stroke-dasharray', '6,4');

        // Crossing arrow under boxes
        var crossArrowY = bottomBoxY + boxH + 26;
        svg.append('line')
            .attr('x1', leftBoxX + boxW - 30).attr('y1', crossArrowY)
            .attr('x2', rightBoxX + 30).attr('y2', crossArrowY)
            .attr('stroke', accent).attr('stroke-width', 1.5);
        svg.append('path')
            .attr('d', 'M' + (rightBoxX + 30) + ',' + crossArrowY + ' l-9,-5 l0,10 z')
            .attr('fill', accent);
        svg.append('text')
            .attr('x', perimX).attr('y', crossArrowY - 6)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('font-style', 'italic').attr('fill', subInk)
            .text('the responsible pathway in');

        // ─── BOTTOM RULE & CLOSING LINE ─────────────────────
        svg.append('line')
            .attr('x1', 80).attr('y1', H - 42).attr('x2', W - 80).attr('y2', H - 42)
            .attr('stroke', rule).attr('stroke-width', 1);
        svg.append('text')
            .attr('x', W / 2).attr('y', H - 18)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('font-style', 'italic').attr('fill', subInk)
            .text('Better still: build it inside Yale from the start.   —   switch to live IBIS demo   —');
    }

    // ─── THE ASK — proven assets meet institutional gates ──
    function theAsk(container, config) {
        var W = 1200, H = 700;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', 'white').attr('fill-opacity', 0);

        var ink = '#1f2937';
        var subInk = '#4b5563';
        var muted = '#6b7280';
        var rule = '#cbd5e1';
        var accent = '#1B3A5C';
        var green = '#065f46';
        var crimson = '#991b1b';

        // ── Top section header ──
        svg.append('text')
            .attr('x', 60).attr('y', 56)
            .attr('font-size', '11px').attr('font-weight', '700')
            .attr('fill', muted).attr('letter-spacing', '2px')
            .text('WHAT EXISTS   ·   WHAT IS MISSING   ·   WHAT IT UNLOCKS');
        svg.append('line')
            .attr('x1', 60).attr('y1', 70).attr('x2', W - 60).attr('y2', 70)
            .attr('stroke', rule).attr('stroke-width', 1);

        // Layout columns
        var leftX = 90;
        var leftW = 280;
        var perimX = 580;
        var rightStartX = 640;
        var destX = 1010;
        var destW = 150;
        var midY = 360;

        // ── LEFT: PROVEN assets ──
        svg.append('text')
            .attr('x', leftX).attr('y', 120)
            .attr('font-size', '13px').attr('font-weight', '700')
            .attr('fill', green).attr('letter-spacing', '1.5px')
            .text('PROVEN');
        svg.append('line')
            .attr('x1', leftX).attr('y1', 130)
            .attr('x2', leftX + leftW).attr('y2', 130)
            .attr('stroke', green).attr('stroke-width', 1.5);

        var assets = [
            { label: 'Methodology',
              detail: 'DevSecOps inside Yale\u2019s perimeter — version control, dependency analysis, security review, CI/CD' },
            { label: 'Track record',
              detail: 'Twenty years building clinical software in pathology informatics' },
            { label: 'Velocity',
              detail: '~100× less effort to reach the same regulated quality bar with AI in the loop' },
            { label: 'Working tools',
              detail: 'Xenonym, IBIS, this presentation — all built with the methodology you just saw' }
        ];

        assets.forEach(function (a, i) {
            var ay = 170 + i * 100;

            // checkmark
            svg.append('path')
                .attr('d', 'M' + leftX + ',' + ay + ' l8,8 l16,-18')
                .attr('fill', 'none').attr('stroke', green)
                .attr('stroke-width', 2.5)
                .attr('stroke-linecap', 'round').attr('stroke-linejoin', 'round');

            svg.append('text')
                .attr('x', leftX + 36).attr('y', ay + 6)
                .attr('font-size', '15px').attr('font-weight', '700')
                .attr('fill', ink).text(a.label);

            // wrap detail in two lines
            var words = a.detail.split(' ');
            var line1 = '', line2 = '';
            var maxChars = 38;
            words.forEach(function (w) {
                if (line1.length + w.length + 1 <= maxChars) {
                    line1 += (line1 ? ' ' : '') + w;
                } else {
                    line2 += (line2 ? ' ' : '') + w;
                }
            });
            svg.append('text')
                .attr('x', leftX + 36).attr('y', ay + 24)
                .attr('font-size', '11px').attr('fill', subInk).text(line1);
            if (line2) {
                svg.append('text')
                    .attr('x', leftX + 36).attr('y', ay + 40)
                    .attr('font-size', '11px').attr('fill', subInk).text(line2);
            }
        });

        // ── PERIMETER: vertical dashed line ──
        var perimTop = 110, perimBot = 600;
        svg.append('line')
            .attr('x1', perimX).attr('y1', perimTop)
            .attr('x2', perimX).attr('y2', perimBot)
            .attr('stroke', crimson).attr('stroke-width', 2.5)
            .attr('stroke-dasharray', '6,4');

        // Rotated label
        svg.append('text')
            .attr('x', perimX).attr('y', perimTop - 14)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('font-weight', '700').attr('fill', crimson)
            .attr('letter-spacing', '1.5px')
            .text('YALE SECURITY PERIMETER');

        // ── DESTINATION on the right ──
        var destH = 200;
        var destY = midY - destH / 2;
        svg.append('rect')
            .attr('x', destX).attr('y', destY)
            .attr('width', destW).attr('height', destH)
            .attr('fill', 'white').attr('stroke', accent).attr('stroke-width', 2.5);
        svg.append('text')
            .attr('x', destX + destW / 2).attr('y', destY + destH / 2 - 28)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('font-weight', '700').attr('fill', muted)
            .attr('letter-spacing', '1.5px').text('UNLOCKS');
        svg.append('text')
            .attr('x', destX + destW / 2).attr('y', destY + destH / 2 - 4)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('font-weight', '700').attr('fill', accent).text('Sustained');
        svg.append('text')
            .attr('x', destX + destW / 2).attr('y', destY + destH / 2 + 12)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('font-weight', '700').attr('fill', accent).text('AI-assisted');
        svg.append('text')
            .attr('x', destX + destW / 2).attr('y', destY + destH / 2 + 28)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('font-weight', '700').attr('fill', accent).text('clinical software');
        svg.append('text')
            .attr('x', destX + destW / 2).attr('y', destY + destH / 2 + 50)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', subInk).attr('font-style', 'italic').text('inside Yale');

        // ── THREE GATES (asks) — arrows piercing the perimeter ──
        var asks = [
            { num: '1', label: 'Enterprise LLM licenses',
              detail: 'sanctioned access to frontier models for research and clinical software development' },
            { num: '2', label: 'Ephemeral provider contracts',
              detail: 'short-lived, task-scoped agreements — no persistent data-sharing relationship' },
            { num: '3', label: 'Sanctioned development pathway',
              detail: 'an institutional route others can adopt, audit, and trust' }
        ];

        var gateYs = [200, 360, 520];

        asks.forEach(function (ask, i) {
            var gy = gateYs[i];

            // numeric badge on the left of perimeter
            var badgeX = perimX - 22;
            svg.append('circle')
                .attr('cx', badgeX).attr('cy', gy)
                .attr('r', 14).attr('fill', 'white')
                .attr('stroke', crimson).attr('stroke-width', 2);
            svg.append('text')
                .attr('x', badgeX).attr('y', gy + 5)
                .attr('text-anchor', 'middle').attr('font-size', '14px')
                .attr('font-weight', '700').attr('fill', crimson)
                .text(ask.num);

            // The "gate" — a gap in the perimeter at this y, drawn as a small white block
            svg.append('rect')
                .attr('x', perimX - 4).attr('y', gy - 8)
                .attr('width', 8).attr('height', 16)
                .attr('fill', 'white');

            // arrow from badge through the perimeter to destination box
            svg.append('line')
                .attr('x1', perimX + 8).attr('y1', gy)
                .attr('x2', destX - 6).attr('y2', gy)
                .attr('stroke', accent).attr('stroke-width', 1.5);
            svg.append('path')
                .attr('d', 'M' + (destX - 6) + ',' + gy + ' l-8,-5 l0,10 z')
                .attr('fill', accent);

            // label above the arrow
            svg.append('text')
                .attr('x', perimX + 24).attr('y', gy - 14)
                .attr('font-size', '14px').attr('font-weight', '700')
                .attr('fill', ink).text(ask.label);

            // detail below the arrow
            svg.append('text')
                .attr('x', perimX + 24).attr('y', gy + 18)
                .attr('font-size', '11px').attr('fill', subInk)
                .attr('font-style', 'italic').text(ask.detail);
        });

        // ── Bottom rule and closing line ──
        svg.append('line')
            .attr('x1', 60).attr('y1', H - 60).attr('x2', W - 60).attr('y2', H - 60)
            .attr('stroke', rule).attr('stroke-width', 1);
        svg.append('text')
            .attr('x', W / 2).attr('y', H - 32)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('font-weight', '700').attr('fill', accent)
            .text('The constraint is institutional, not technical — and it is solvable.');
        svg.append('text')
            .attr('x', W / 2).attr('y', H - 14)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('font-style', 'italic').attr('fill', muted)
            .text('I am not asking for a budget. I am asking for a pathway.');
    }


    // ─── REGISTRY (map name → function) ──────────────────────
    var registry = {
        'workflow-pipeline': workflowPipeline,
        'abstraction-layers': abstractionLayers,
        'systems-ecosystem': systemsEcosystem,
        'ai-maturity-ladder': aiMaturityLadder,
        'data-flow': dataFlow,
        'automation-ladder': automationLadder,
        'phase-comparison': phaseComparison,
        'case-timeline': caseTimeline,
        'measurement-intervals': measurementIntervals,
        'animated-pipeline': animatedPipeline,
        'seven-options-ladder': sevenOptionsLadder,
        'cost-comparison': costComparison,
        'tech-stack-pyramid': techStackPyramid,
        'dev-lifecycle-loop': devLifecycleLoop,
        'realm-diagram': realmDiagram,
        'feedback-loop': feedbackLoop,
        'cognitive-load': cognitiveLoad,
        'liberation-pattern': liberationPattern,
        'stack-comparison': stackComparison,
        'xenonym-browser': xenonymBrowser,
        'presentation-architecture': presentationArchitecture,
        'tufte-timeline': tufteTimeline,
        'governing-principle': governingPrinciple,
        'blank-page': blankPage,
        'three-observations': threeObservations,
        'institutional-context': institutionalContext,
        'evaluation-cost': evaluationCost,
        'architectural-judgment': architecturalJudgment,
        'tacit-knowledge': tacitKnowledge,
        'syllabic-mixing': syllabicMixing,
        'wrong-question': wrongQuestion,
        'xenonym-synthesis': xenonymSynthesis,
        'ibis-flow': ibisFlow,
        'the-ask': theAsk
    };

    function render(name, container, config) {
        var fn = registry[name];
        if (fn) fn(container, config || {});
        else console.warn('VizLibrary: unknown visualization "' + name + '"');
    }

    return { render: render, registry: registry };
})();
